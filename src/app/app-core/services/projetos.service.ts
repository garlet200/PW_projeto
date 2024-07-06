import { Injectable } from '@angular/core';
import { ProjetoInfo } from "../model/projetoInfo";
import Dexie from "dexie";

@Injectable({
  providedIn: 'root'
})
export class ProjetosService extends Dexie {

  projetos: Dexie.Table<ProjetoInfo, number>;
  constructor() {
    super('ProjetoDB');
    this.version(1).stores({
      projetos: '++id, titulo, autor, anoConclusao, semestreConclusao, linkFigma, linkYoutube, relatorio, thumbnail'
    });
    this.projetos = this.table('projetos');
  }

  async adicionarProjeto(projeto: ProjetoInfo): Promise<number> {
    return await this.projetos.add(projeto);
  }

  async buscarProjetos(): Promise<ProjetoInfo[]>{
    return await this.projetos.toArray();
  }

  async removerProjeto(id:number): Promise <void> {
    return await this.projetos.delete(id);
  }

  async atualizarProjeto(id: number, projeto: ProjetoInfo): Promise<number>{
    return await this.projetos.update(id, projeto);
  }
}


