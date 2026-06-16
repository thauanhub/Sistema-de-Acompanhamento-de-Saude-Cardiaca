import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegistroSaude } from './acompanhamento';

export interface ResumoRelatorio {
  total_registros: number;
  media_frequencia_cardiaca: number | null;
  media_oxigenacao: number | null;
  media_peso: number | null;
}

export interface UltimoRegistroRelatorio {
  pressao_arterial?: string;
  frequencia_cardiaca?: number;
  nivel_oxigenacao?: number;
  peso?: number;
  sintomas?: string;
  data?: string;
  mensagem?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RelatoriosService {
  //private apiUrl = 'http://localhost:8000';
  private apiUrl = 'http://192.168.0.8:8000';
  //private apiUrl = 'https://1bbdb1a1b1802e.lhr.life';

  constructor(private http: HttpClient) { }

  buscarResumo(): Observable<ResumoRelatorio> {
    return this.http.get<ResumoRelatorio>(`${this.apiUrl}/relatorios/resumo`);
  }

  buscarUltimoRegistro(): Observable<UltimoRegistroRelatorio> {
    return this.http.get<UltimoRegistroRelatorio>(`${this.apiUrl}/relatorios/ultimo`);
  }

  buscarHistorico(): Observable<RegistroSaude[]> {
    return this.http.get<RegistroSaude[]>(`${this.apiUrl}/acompanhamento/`);
  }
}