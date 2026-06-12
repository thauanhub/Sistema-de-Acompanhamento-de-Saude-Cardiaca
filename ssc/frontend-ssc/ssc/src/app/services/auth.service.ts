import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

export interface RegistroRequest {
  nome: string;
  email: string;
  data_nascimento: string;
  sexo: string;
  celular: string;
  pais: string;
  senha: string;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface AuthResponse {
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
  user?: any;
  message?: string;
  mensagem?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/auth'; // URL do backend
  private usuarioAtual = new BehaviorSubject<any>(null);
  public usuarioAtual$ = this.usuarioAtual.asObservable();

  constructor(private http: HttpClient) {
    this.verificarUsuarioLogado();
  }

  /**
   * Registra um novo usuário
   */
  registrar(dados: RegistroRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, dados);
  }

  /**
   * Faz login do usuário
   */
  login(dados: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, dados);
  }

  /**
   * Faz logout do usuário
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.usuarioAtual.next(null);
  }

  /**
   * Verifica se há um usuário logado
   */
  verificarUsuarioLogado(): void {
    const token = localStorage.getItem('token');
    const usuario = localStorage.getItem('usuario');

    if (token && usuario) {
      this.usuarioAtual.next(JSON.parse(usuario));
    }
  }

  /**
   * Obtém o token armazenado
   */
  obterToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Verifica se o usuário está autenticado
   */
  estaAutenticado(): boolean {
    return !!this.obterToken();
  }

  /**
   * Obtém o usuário atual
   */
  obterUsuarioAtual(): any {
    return this.usuarioAtual.value;
  }

  /**
   * Salva o token e usuário no localStorage
   */
  salvarSessao(token: string, usuario: any): void {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    this.usuarioAtual.next(usuario);
  }

  /**
   * Obtém dados do usuário pelo token
   */
  obterDadosUsuario(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`);
  }
}
