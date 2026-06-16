import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Aqui criamos a Interface que imita o seu RegistroSchema do Python!
export interface RegistroSaude {
  pressao_arterial: string;
  frequencia_cardiaca: number;
  nivel_oxigenacao: number;
  peso: number;
  data: string; // formato YYYY-MM-DD
  sintomas?: string; // Opcional
}

@Injectable({
  providedIn: 'root'
})
export class AcompanhamentoService {
  //private apiUrl = 'http://localhost:8000/acompanhamento/';
  private apiUrl = 'http://192.168.0.8:8000/acompanhamento/';
  //private apiUrl = 'https://1bbdb1a1b1802e.lhr.life/acompanhamento/';

  constructor(private http: HttpClient) { }

  /**
   * Dispara um POST para salvar os dados
   */
  registrar(dados: RegistroSaude): Observable<any> {
    return this.http.post(this.apiUrl, dados);
  }

  /**
   * Dispara um GET para buscar a lista de registros
   */
  listarHistorico(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}