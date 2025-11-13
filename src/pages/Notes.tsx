import { useState, useEffect } from 'react';
import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonText,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonModal,
  IonTextarea,
  IonFab,
  IonFabButton,
  useIonToast,
  useIonAlert
} from '@ionic/react';
import { 
  addOutline, 
  trashOutline, 
  documentTextOutline, 
  createOutline, 
  closeOutline,
  checkmarkOutline,
  timeOutline
} from 'ionicons/icons';
import { useParams } from 'react-router-dom';
import { NotesStorage } from '../services/notesStorage';
import './Notes.css';

interface RouteParams {
  subject: string;
}

interface Note {
  id: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

const Notes: React.FC = () => {
  const { subject } = useParams<RouteParams>();
  const decodedSubject = decodeURIComponent(subject);
  
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState<string>('');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editContent, setEditContent] = useState<string>('');
  const [present] = useIonToast();
  const [presentAlert] = useIonAlert();

  useEffect(() => {
    loadNotes();
  }, [decodedSubject]);

  const loadNotes = async () => {
    try {
      const result = await NotesStorage.getNotes(decodedSubject);
      // Chuyển đổi từ string[] sang Note[] nếu cần
      const loadedNotes: Note[] = result.value 
        ? JSON.parse(result.value).map((content: string | Note, index: number) => {
            if (typeof content === 'string') {
              // Migrate old format
              return {
                id: `note-${Date.now()}-${index}`,
                content: content,
                createdAt: Date.now(),
                updatedAt: Date.now()
              };
            }
            return content;
          })
        : [];
      setNotes(loadedNotes);
    } catch (error) {
      console.error('Error loading notes:', error);
      present({
        message: 'Không thể tải ghi chú!',
        duration: 2000,
        color: 'danger'
      });
    }
  };

  const saveNotes = async (notesToSave: Note[]) => {
    try {
      await NotesStorage.set({
        key: `notes_${decodedSubject}`,
        value: JSON.stringify(notesToSave)
      });
    } catch (error) {
      console.error('Error saving notes:', error);
      throw error;
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) {
      present({
        message: 'Vui lòng nhập nội dung ghi chú!',
        duration: 2000,
        color: 'warning'
      });
      return;
    }

    try {
      const newNoteObj: Note = {
        id: `note-${Date.now()}`,
        content: newNote.trim(),
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      const updatedNotes = [...notes, newNoteObj];
      await saveNotes(updatedNotes);
      setNotes(updatedNotes);
      setNewNote('');
      present({
        message: 'Đã thêm ghi chú thành công!',
        duration: 1500,
        color: 'success',
        icon: checkmarkOutline
      });
    } catch (error) {
      console.error('Error adding note:', error);
      present({
        message: 'Không thể thêm ghi chú!',
        duration: 2000,
        color: 'danger'
      });
    }
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setEditContent(note.content);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim()) {
      present({
        message: 'Nội dung không được để trống!',
        duration: 2000,
        color: 'warning'
      });
      return;
    }

    try {
      const updatedNotes = notes.map(note => 
        note.id === editingNote?.id 
          ? { ...note, content: editContent.trim(), updatedAt: Date.now() }
          : note
      );
      await saveNotes(updatedNotes);
      setNotes(updatedNotes);
      setShowEditModal(false);
      setEditingNote(null);
      setEditContent('');
      present({
        message: 'Đã cập nhật ghi chú!',
        duration: 1500,
        color: 'success',
        icon: checkmarkOutline
      });
    } catch (error) {
      console.error('Error updating note:', error);
      present({
        message: 'Không thể cập nhật ghi chú!',
        duration: 2000,
        color: 'danger'
      });
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    presentAlert({
      header: 'Xác nhận xóa',
      message: 'Bạn có chắc muốn xóa ghi chú này?',
      buttons: [
        {
          text: 'Hủy',
          role: 'cancel'
        },
        {
          text: 'Xóa',
          role: 'destructive',
          handler: async () => {
            try {
              const updatedNotes = notes.filter(note => note.id !== noteId);
              await saveNotes(updatedNotes);
              setNotes(updatedNotes);
              present({
                message: 'Đã xóa ghi chú!',
                duration: 1500,
                color: 'success'
              });
            } catch (error) {
              console.error('Error deleting note:', error);
              present({
                message: 'Không thể xóa ghi chú!',
                duration: 2000,
                color: 'danger'
              });
            }
          }
        }
      ]
    });
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    
    return date.toLocaleDateString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>{decodedSubject}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="notes-content">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{decodedSubject}</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className="notes-container">
          {/* Header Stats */}
          <div className="notes-header">
            <div className="hero-content">
              <IonIcon icon={documentTextOutline} className="hero-icon" />
              <h1>{decodedSubject}</h1>
              <p>Quản lý ghi chú học tập của bạn</p>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="stats-summary">
            <div className="stat-item">
              <IonIcon icon={documentTextOutline} />
              <div className="stat-info">
                <h3>{notes.length}</h3>
                <p>Ghi chú</p>
              </div>
            </div>
            <div className="stat-item">
              <IonIcon icon={timeOutline} />
              <div className="stat-info">
                <h3>{notes.length > 0 ? 'Mới' : '--'}</h3>
                <p>Cập nhật</p>
              </div>
            </div>
          </div>

          {/* Form thêm ghi chú mới */}
          <IonCard className="add-note-card">
            <IonCardContent>
              <div className="add-note-header">
                <IonIcon icon={addOutline} className="add-icon" />
                <h3>Thêm ghi chú mới</h3>
              </div>
              <IonItem className="input-item" lines="none">
                <IonTextarea
                  value={newNote}
                  placeholder="Nhập nội dung ghi chú..."
                  autoGrow={true}
                  rows={2}
                  onIonInput={(e) => setNewNote(e.detail.value!)}
                />
              </IonItem>
              <IonButton 
                expand="block" 
                onClick={handleAddNote}
                className="add-button"
                disabled={!newNote.trim()}
              >
                <IonIcon icon={checkmarkOutline} slot="start" />
                Thêm ghi chú
              </IonButton>
            </IonCardContent>
          </IonCard>

          {/* Danh sách ghi chú */}
          <div className="notes-list-section">
            {notes.length === 0 ? (
              <IonCard className="empty-state">
                <IonCardContent>
                  <IonIcon icon={documentTextOutline} className="empty-icon" />
                  <IonText color="medium">
                    <h3>Chưa có ghi chú nào</h3>
                    <p>Hãy thêm ghi chú đầu tiên để bắt đầu!</p>
                  </IonText>
                </IonCardContent>
              </IonCard>
            ) : (
              <div className="notes-grid">
                {notes.map((note, index) => (
                  <IonCard key={note.id} className="note-card">
                    <IonCardContent>
                      <div className="note-card-header">
                        <div className="note-badge">#{index + 1}</div>
                        <div className="note-actions">
                          <IonButton 
                            fill="clear" 
                            size="small"
                            onClick={() => handleEditNote(note)}
                          >
                            <IonIcon icon={createOutline} slot="icon-only" />
                          </IonButton>
                          <IonButton 
                            fill="clear" 
                            size="small" 
                            color="danger"
                            onClick={() => handleDeleteNote(note.id)}
                          >
                            <IonIcon icon={trashOutline} slot="icon-only" />
                          </IonButton>
                        </div>
                      </div>
                      <div className="note-card-content">
                        <p>{note.content}</p>
                      </div>
                      <div className="note-card-footer">
                        <IonIcon icon={timeOutline} />
                        <span>{formatDate(note.updatedAt)}</span>
                      </div>
                    </IonCardContent>
                  </IonCard>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* FAB Button - Quick Add */}
        {notes.length > 3 && (
          <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton onClick={() => {
              document.querySelector('.add-note-card')?.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
              });
              const textarea = document.querySelector('.input-item ion-textarea') as HTMLElement;
              setTimeout(() => textarea?.focus(), 300);
            }}>
              <IonIcon icon={addOutline} />
            </IonFabButton>
          </IonFab>
        )}

        {/* Edit Modal */}
        <IonModal 
          isOpen={showEditModal} 
          onDidDismiss={() => {
            setShowEditModal(false);
            setEditingNote(null);
            setEditContent('');
          }}
          className="edit-modal"
        >
          <IonHeader>
            <IonToolbar color="primary">
              <IonTitle>Chỉnh sửa ghi chú</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowEditModal(false)}>
                  <IonIcon icon={closeOutline} slot="icon-only" />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonCard className="edit-card">
              <IonCardContent>
                <IonItem lines="none">
                  <IonTextarea
                    value={editContent}
                    placeholder="Nhập nội dung ghi chú..."
                    autoGrow={true}
                    rows={5}
                    onIonInput={(e) => setEditContent(e.detail.value!)}
                    className="edit-textarea"
                  />
                </IonItem>
                {editingNote && (
                  <div className="edit-info">
                    <IonIcon icon={timeOutline} />
                    <span>Tạo: {formatDate(editingNote.createdAt)}</span>
                  </div>
                )}
              </IonCardContent>
            </IonCard>
            <IonButton 
              expand="block" 
              onClick={handleSaveEdit}
              disabled={!editContent.trim()}
              className="save-button"
            >
              <IonIcon icon={checkmarkOutline} slot="start" />
              Lưu thay đổi
            </IonButton>
            <IonButton 
              expand="block" 
              fill="outline" 
              onClick={() => setShowEditModal(false)}
            >
              Hủy
            </IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Notes;
