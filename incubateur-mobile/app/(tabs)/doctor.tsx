import api from '../service/api';

export interface Doctor {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  specialite: string;
  numeroLicence: string;
  hopital: {
    nom: string;
    adresse?: {
      ville?: string;
    };
  };
  bebes?: any[];
  nombrePatients?: number;
}

export interface CreateDoctorData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  specialite: string;
  numeroLicence: string;
  hopital: {
    nom: string;
    adresse?: {
      ville?: string;
    };
  };
}

class DoctorService {
  // Récupérer tous les docteurs
  async getAllDoctors(): Promise<Doctor[]> {
    try {
      const response = await api.get<{ data: { doctors: Doctor[] } }>('/doctors');
      return response.data?.doctors || [];
    } catch (error) {
      console.error('Erreur chargement docteurs:', error);
      return [];
    }
  }

  // Récupérer un docteur par ID
  async getDoctorById(id: string): Promise<Doctor | null> {
    try {
      const response = await api.get<{ data: { doctor: Doctor } }>(`/doctors/${id}`);
      return response.data?.doctor || null;
    } catch (error) {
      console.error('Erreur chargement docteur:', error);
      return null;
    }
  }

  // Créer un nouveau docteur (admin seulement)
  async createDoctor(doctorData: CreateDoctorData): Promise<Doctor | null> {
    try {
      const response = await api.post<{ data: { doctor: Doctor } }>('/doctors', doctorData);
      return response.data?.doctor || null;
    } catch (error) {
      console.error('Erreur création docteur:', error);
      return null;
    }
  }

  // Assigner un docteur à un bébé
  async assignDoctorToBaby(babyId: string, doctorId: string): Promise<boolean> {
    try {
      await api.put(`/babies/${babyId}/assign-doctor/${doctorId}`, {});
      return true;
    } catch (error) {
      console.error('Erreur assignation docteur:', error);
      return false;
    }
  }

  // Récupérer le docteur d'un bébé
  async getBabyDoctor(babyId: string): Promise<Doctor | null> {
    try {
      const response = await api.get<{ data: { doctor: Doctor } }>(`/babies/${babyId}/doctor`);
      return response.data?.doctor || null;
    } catch (error) {
      console.error('Erreur chargement docteur du bébé:', error);
      return null;
    }
  }
}

export default new DoctorService();