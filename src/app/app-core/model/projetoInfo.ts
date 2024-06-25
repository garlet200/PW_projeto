export class ProjetoInfo {

  titulo: string;
  autor: string;
  anoConclusao: number;
  semestreConclusao: number;
  // linkFigma?: string;
  // linkYoutube?: string;
  // relatorio?: string;
  thumbnail?: string;
  id?: number;

  constructor(titulo: string,
              autor: string,
              anoConc: number,
              semestreConc: number,
              // linkFigma?: string,
              // linkYoutube?: string,
              // relatorio?: string,
              thumbnail?: string,
              id?: number
  ) {
    this.titulo = titulo;
    this.autor = autor;
    this.anoConclusao = anoConc;
    this.semestreConclusao = semestreConc;
    // this.linkFigma = linkFigma;
    // this.linkYoutube = linkYoutube;
    // this.relatorio = relatorio;
    this.thumbnail = thumbnail;
    this.id = id;
  }
}
