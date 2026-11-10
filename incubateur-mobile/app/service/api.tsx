const API_URL = 'http://192.168.100.8:5000/api'; 

interface ApiResponse {
  status: string;
  token?: string;
  data?: any;
  message?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

class ApiService {
  private token: string | null = null;

  setToken(token: string | null): void {
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, { ...options, headers });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Une erreur est survenue');
      }

      return data as T;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Erreur réseau');
    }
  }

  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  post<T>(endpoint: string, body: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  put<T>(endpoint: string, body: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  async login(credentials: LoginCredentials): Promise<ApiResponse> {
    return this.post<ApiResponse>('users/login', credentials);
  }

  async getMe(): Promise<ApiResponse> {
    return this.get<ApiResponse>('users/me');
  }


  async logout(): Promise<ApiResponse> {
    return this.post<ApiResponse>('users/logout', {});
  }
  async getBabies(): Promise<ApiResponse> {
    return this.get<ApiResponse>('baby/all');
  }
}

export default new ApiService();