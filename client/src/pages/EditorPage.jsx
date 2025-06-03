// EditorPage.jsx

import { useRef, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { db } from '../firebaseConfig';
import { collection, addDoc, getDocs, query, where, serverTimestamp, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import Navbar from '../components/Navbar';
import Copyright from '../components/Copyright';
import Editor from '../components/Editor';
import LoadModal from '../components/LoadModal';
import AlertModal from '../components/AlertModal';
import '../css/EditorPage.css';

const EditorPage = () => {
    const navigate = useNavigate();
    const authInstance = getAuth();
    const editorRef = useRef(null);
    
    const [currentDocumentId, setCurrentDocumentId] = useState(null);
    const [documentTitleInput, setDocumentTitleInput] = useState("Untitled Document");

    const [isLoadModalVisible, setIsLoadModalVisible] = useState(false);
    const [documentsList, setDocumentsList] = useState([]);
    
    const [alertState, setAlertState] = useState({ isVisible: false, title: '', message: '', type: 'info' });
    const [isLoadingData, setIsLoadingData] = useState(false); 
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (editorRef.current && authInstance.currentUser) {
            editorRef.current.resetEditor();
        }
        setDocumentTitleInput("Untitled Document");
    }, [authInstance.currentUser]);


    const showAlert = (title, message, type = 'info', duration = 3000, onConfirmCallback = null, confirmBtnText = null) => {
        setAlertState({ isVisible: true, title, message, type, onConfirm: onConfirmCallback, confirmText: confirmBtnText });
        if (type !== 'loading' && type !== 'warning' && duration) {
            setTimeout(() => setAlertState(prev => ({ ...prev, isVisible: false })), duration);
        }
    };
    const closeAlert = () => setAlertState(prev => ({ ...prev, isVisible: false }));

    const handleNew = () => {
        if (editorRef.current) editorRef.current.resetEditor();
        setCurrentDocumentId(null);
        setDocumentTitleInput("Untitled Document");
    };

    const handleTitleInputChange = (e) => {
        setDocumentTitleInput(e.target.value);
    };

    const updateTitleInFirestore = useCallback(async (newTitle) => {
        const user = authInstance.currentUser;
        if (currentDocumentId && user && newTitle) {
            try {
                const docRef = doc(db, "documents", currentDocumentId);
                await updateDoc(docRef, {
                    title: newTitle,
                    updatedAt: serverTimestamp()
                });
            } catch (error) {
                console.error("Error updating title in Firestore: ", error);
                showAlert("Error", "Failed to update document title in database.", "error");
            }
        }
    }, [currentDocumentId, authInstance]);

    const handleTitleInputBlur = () => {
        const newTitle = documentTitleInput.trim() || "Untitled Document";
        if (newTitle !== documentTitleInput) {
            setDocumentTitleInput(newTitle);
        }
        if (currentDocumentId) {
            updateTitleInFirestore(newTitle);
        }
    };

    const handleSave = async () => {
        const user = authInstance.currentUser;
        if (!user || !editorRef.current || isSaving) return;
        setIsSaving(true);
        showAlert("Saving...", "Please wait.", "loading", 0); 
        
        const editorContentHTML = editorRef.current.getContentHTML();
        const titleToSave = documentTitleInput.trim() || "Untitled Document";
        
        const docData = {
            userId: user.uid,
            title: titleToSave,
            editorContent: editorContentHTML,
            updatedAt: serverTimestamp(),
        };

        try {
            if (currentDocumentId) {
                await setDoc(doc(db, "documents", currentDocumentId), docData, { merge: true });
            } else {
                const docRef = await addDoc(collection(db, "documents"), {
                    ...docData,
                    createdAt: serverTimestamp(),
                });
                setCurrentDocumentId(docRef.id);
            }
            if (documentTitleInput !== titleToSave) setDocumentTitleInput(titleToSave);
            showAlert("Success!", `Document "${titleToSave}" saved.`, "success");
        } catch (error) {
            console.error("Error saving document: ", error);
            showAlert("Error", "Failed to save document.", "error");
        } finally {
            setIsSaving(false);
            if (alertState.type === 'loading') closeAlert();
        }
    };
    
    const handleLoadClick = async () => {
        const user = authInstance.currentUser;
        if (!user) return;
        setIsLoadingData(true);
        showAlert("Loading Documents...", "Fetching your saved notes.", "loading", 0);
        try {
            const q = query(collection(db, "documents"), where("userId", "==", user.uid), where("title", "!=", null));
            const querySnapshot = await getDocs(q);
            const docs = querySnapshot.docs.map(d => ({ id: d.id, data: d.data() }));
            setDocumentsList(docs.sort((a,b) => (b.data.updatedAt?.seconds || 0) - (a.data.updatedAt?.seconds || 0) ));
            setIsLoadModalVisible(true);
            closeAlert();
        } catch (error) {
            console.error("Error fetching documents: ", error);
            showAlert("Error", "Failed to fetch documents.", "error");
        } finally {
            setIsLoadingData(false);
        }
    };

    const handleSelectDocument = (data, id, title) => {
        if (editorRef.current) {
            editorRef.current.setContent(data.editorContent || '', 'html');
        }
        setCurrentDocumentId(id);
        setDocumentTitleInput(title || "Untitled Document");
        setIsLoadModalVisible(false);
    };

    const handleDeleteDocument = async (docIdToDelete) => {
        const user = authInstance.currentUser;
        if (!user || !docIdToDelete) return;
        
        showAlert(
            "Confirm Deletion", 
            `Are you sure you want to delete "${documentsList.find(d=>d.id === docIdToDelete)?.data.title || 'this document'}"? This cannot be undone.`,
            "warning", 0,
            async () => {
                closeAlert();
                setIsLoadingData(true);
                showAlert("Deleting...", "Please wait.", "loading", 0);
                try {
                    await deleteDoc(doc(db, "documents", docIdToDelete));
                    setDocumentsList(prevDocs => prevDocs.filter(d => d.id !== docIdToDelete));
                    if (currentDocumentId === docIdToDelete) handleNew();
                    showAlert("Success", "Document deleted.", "success");
                } catch (error) {
                    console.error("Error deleting document: ", error);
                    showAlert("Error", "Failed to delete document.", "error");
                } finally {
                    setIsLoadingData(false);
                    if (alertState.type === 'loading') closeAlert();
                }
            },
            "Delete"
        );
    };

    const handleExport = () => {
        if (editorRef.current) {
            const editorContentHTML = editorRef.current.getContentHTML();
            const htmlContent = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${documentTitleInput || "Exported Document"}</title><style>body { margin: 20px; background-color: #1e1e1e; color: #d4d4d4; font-family: 'Inter', sans-serif; } .ProseMirror {outline: none;} </style></head><body>${editorContentHTML}</body></html>`;
            const blob = new Blob([htmlContent], { type: 'text/html' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${(documentTitleInput || "document").replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(authInstance);
        } catch (error) {
            console.error('Error signing out:', error);
            showAlert("Error", "Failed to sign out.", "error");
        }
    };

    return (
        <div className='editor-page'>
            <AlertModal {...alertState} onClose={closeAlert} />
            <div className='banner'>
                <Navbar 
                    onNew={handleNew}
                    onExport={handleExport}
                    onSave={handleSave}
                    onLoad={handleLoadClick}
                    onLogout={handleLogout}
                />
            </div>
            <div className="document-title-bar">
                <input 
                    type="text" 
                    className="document-title-input-field"
                    value={documentTitleInput}
                    onChange={handleTitleInputChange}
                    onBlur={handleTitleInputBlur}
                    placeholder="Untitled Document"
                    disabled={isSaving || isLoadingData}
                />
            </div>
            <section className='content'>
                <Editor ref={editorRef} />
            </section>
            <footer className='footer'>
                <Copyright />
            </footer>
            <LoadModal
                isVisible={isLoadModalVisible}
                onClose={() => setIsLoadModalVisible(false)}
                documents={documentsList}
                onSelectDocument={handleSelectDocument}
                onDeleteDocument={handleDeleteDocument}
            />
        </div>
    );
};

export default EditorPage;