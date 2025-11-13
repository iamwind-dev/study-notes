import { useState, useEffect } from 'react';
import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar,
  IonIcon,
  IonCard,
  IonCardContent,
  IonText,
  IonFab,
  IonFabButton,
  IonModal,
  IonButton,
  IonButtons,
  IonInput,
  IonItem,
  IonLabel,
  useIonToast
} from '@ionic/react';
import { 
  bookOutline, 
  chevronForwardOutline, 
  schoolOutline,
  documentTextOutline,
  calculatorOutline,
  flashOutline,
  beakerOutline,
  languageOutline,
  desktopOutline,
  addOutline,
  closeOutline,
  checkmarkOutline
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { subjects as initialSubjects } from '../data/subjects';
import { Preferences } from '@capacitor/preferences';
import './Home.css';

const Home: React.FC = () => {
  const history = useHistory();
  const [subjects, setSubjects] = useState<string[]>(initialSubjects);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [present] = useIonToast();

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      const result = await Preferences.get({ key: 'custom_subjects' });
      if (result.value) {
        const customSubjects = JSON.parse(result.value);
        setSubjects([...initialSubjects, ...customSubjects]);
      }
    } catch (error) {
      console.error('Error loading subjects:', error);
    }
  };

  const saveCustomSubjects = async (customSubjects: string[]) => {
    try {
      await Preferences.set({
        key: 'custom_subjects',
        value: JSON.stringify(customSubjects)
      });
    } catch (error) {
      console.error('Error saving subjects:', error);
    }
  };

  const handleAddSubject = async () => {
    if (!newSubject.trim()) {
      present({
        message: 'Vui lòng nhập tên môn học!',
        duration: 2000,
        color: 'warning'
      });
      return;
    }

    if (subjects.includes(newSubject.trim())) {
      present({
        message: 'Môn học đã tồn tại!',
        duration: 2000,
        color: 'warning'
      });
      return;
    }

    const newSubjectName = newSubject.trim();
    const updatedSubjects = [...subjects, newSubjectName];
    setSubjects(updatedSubjects);
    
    // Lưu các môn học tùy chỉnh (không bao gồm môn học mặc định)
    const customSubjects = updatedSubjects.filter(s => !initialSubjects.includes(s));
    await saveCustomSubjects(customSubjects);

    present({
      message: 'Đã thêm môn học mới!',
      duration: 1500,
      color: 'success',
      icon: checkmarkOutline
    });

    setNewSubject('');
    setShowAddModal(false);
  };

  const handleSubjectClick = (subject: string) => {
    history.push(`/notes/${encodeURIComponent(subject)}`);
  };

  // Icon mapping cho từng môn học - dùng icon mặc định cho môn học tùy chỉnh
  const getSubjectIcon = (subject: string): string => {
    const defaultIcons: { [key: string]: string } = {
      'Toán': calculatorOutline,
      'Lý': flashOutline,
      'Hóa': beakerOutline,
      'Anh': languageOutline,
      'CNTT': desktopOutline
    };
    return defaultIcons[subject] || bookOutline; // Dùng bookOutline cho môn học tùy chỉnh
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Study Notes</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="home-content">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Study Notes</IonTitle>
          </IonToolbar>
        </IonHeader>
        
        <div className="home-container">
          {/* Hero Header */}
          <div className="home-header">
            <div className="hero-content">
              <IonIcon icon={schoolOutline} className="hero-icon" />
              <h1>Ghi chú học tập</h1>
              <p>Tổ chức ghi chú theo từng môn học một cách hiệu quả</p>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="stats-summary">
            <div className="stat-item">
              <IonIcon icon={bookOutline} />
              <div className="stat-info">
                <h3>{subjects.length}</h3>
                <p>Môn học</p>
              </div>
            </div>
            <div className="stat-item">
              <IonIcon icon={documentTextOutline} />
              <div className="stat-info">
                <h3>∞</h3>
                <p>Ghi chú</p>
              </div>
            </div>
          </div>

          {/* Subjects Section */}
          <div className="subjects-section">
            <div className="section-header">
              <h2>
                <IonIcon icon={bookOutline} />
                Chọn môn học
              </h2>
              <IonText color="medium">
                <p>Nhấn vào môn học để xem và quản lý ghi chú</p>
              </IonText>
            </div>

            <div className="subjects-grid">
              {subjects.map((subject, index) => (
                <IonCard 
                  key={index} 
                  button
                  onClick={() => handleSubjectClick(subject)}
                  className="subject-card"
                >
                  <IonCardContent>
                    <div className="subject-card-header">
                      <IonIcon icon={getSubjectIcon(subject)} className="subject-icon" />
                      <IonIcon icon={chevronForwardOutline} className="arrow-icon" />
                    </div>
                    <div className="subject-card-content">
                      <h3>{subject}</h3>
                      <p>Nhấn để xem ghi chú</p>
                    </div>
                  </IonCardContent>
                </IonCard>
              ))}
            </div>
          </div>
        </div>

        {/* FAB Button - Add Subject */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => setShowAddModal(true)} color="primary">
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>

        {/* Add Subject Modal */}
        <IonModal 
          isOpen={showAddModal} 
          onDidDismiss={() => {
            setShowAddModal(false);
            setNewSubject('');
          }}
          className="add-subject-modal"
        >
          <IonHeader>
            <IonToolbar color="primary">
              <IonTitle>Thêm môn học mới</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowAddModal(false)}>
                  <IonIcon icon={closeOutline} slot="icon-only" />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <div className="add-subject-content">
              <IonItem className="input-item">
                <IonLabel position="stacked">Tên môn học</IonLabel>
                <IonInput
                  value={newSubject}
                  placeholder="Ví dụ: Sinh học, Địa lý, Lịch sử..."
                  onIonInput={(e) => setNewSubject(e.detail.value!)}
                  clearInput
                />
              </IonItem>

              <div className="preview-section">
                <IonLabel>Xem trước:</IonLabel>
                <IonCard className="preview-card">
                  <IonCardContent>
                    <div className="subject-card-header">
                      <IonIcon icon={bookOutline} className="subject-icon" />
                      <IonIcon icon={chevronForwardOutline} className="arrow-icon" />
                    </div>
                    <div className="subject-card-content">
                      <h3>{newSubject || 'Tên môn học'}</h3>
                      <p>Nhấn để xem ghi chú</p>
                    </div>
                  </IonCardContent>
                </IonCard>
              </div>
            </div>
            
            <div className="modal-actions">
              <IonButton 
                expand="block" 
                onClick={handleAddSubject}
                disabled={!newSubject.trim()}
                color="primary"
              >
                <IonIcon icon={checkmarkOutline} slot="start" />
                Thêm môn học
              </IonButton>
              <IonButton 
                expand="block" 
                fill="outline" 
                color="medium"
                onClick={() => setShowAddModal(false)}
              >
                <IonIcon icon={closeOutline} slot="start" />
                Hủy
              </IonButton>
            </div>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Home;
