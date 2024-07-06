import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ProjetoInfo } from "../../app-core/model/projetoInfo";
import { ProjetosService } from "../../app-core/services/projetos.service";
declare var $ : any;
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-projetos',
  templateUrl: './editar-projetos.component.html',
  styleUrls: ['./editar-projetos.component.css']
})
export class EditarProjetosComponent implements OnInit {

  activeOption!: string;
  form: FormGroup;
  projetos: any [] = [];


  constructor( private projetoService: ProjetosService,
               private fb: FormBuilder) {
    this.form =  this.fb.group ({
      tituloProjeto: ['', Validators.required],
      autorProjeto: ['', Validators.required],
      anoConclusaoProjeto: ['', Validators.required],
      semestreConclusaoProjeto: ['', Validators.required],
      linkFigmaProjeto: [''],
      linkYoutubeProjeto: [''],
      relatorioProjeto: [''],
      thumbnailProjeto: [],
      id: [0],
    })
  }

  openModal(){
    $('#add-projeto').modal('show');
  }
  closeModal(){
    $('#add-projeto').modal('hide');
  }

  submitForm(){
    if(this.form.value.id > 0){
      this.editarProjeto();
    }else{
      this.salvarFormProjeto();
    }
  }

  salvarFormProjeto() {
    if (this.form.valid){
      // Define o caminho da imagem padrão
      const defaultThumbnail = '../../../assets/test.png';
      // Verifica se a thumbnail está preenchida, caso contrário, atribui a imagem padrão
      const thumbnailProjeto = this.form.value.thumbnailProjeto ? this.form.value.thumbnailProjeto : defaultThumbnail;

      const novoProjeto: ProjetoInfo = new ProjetoInfo(
        this.form.value.tituloProjeto,
        this.form.value.autorProjeto,
        this.form.value.anoConclusaoProjeto,
        this.form.value.semestreConclusaoProjeto,
        this.form.value.linkFigmaProjeto,
        this.form.value.linkYoutubeProjeto,
        this.form.value.relatorioProjeto,
        thumbnailProjeto,
        undefined
      );
      console.log('Dados do projeto adicionado', novoProjeto)
      this.projetoService.adicionarProjeto(novoProjeto).then(resposta =>{
        if (resposta > 0){
          Swal.fire('Pronto!', 'Projeto salvo.', 'success');
          this.form.reset();
          this.closeModal();
          this.listarProjetos(this.activeOption);
        }
      }).catch(respostaError => {
        Swal.fire('Não foi dessa vez', 'Não foi possível salvar a tarefa, ' +
          'tente novamente mais tarde', 'error');
        console.log(respostaError);
      })
    }else {
      console.log("CAMPOS INVALIDOS ENCONTRADOS.");
      console.log("DADOS DOS CAMPOS: ", this.form.value);
      Swal.fire('Atenção', 'Algo está incorreto.', 'warning');
      this.marcarCamposVazios();
    }
  }

  isCampoValido(inputNome: string) : boolean {
    const campo: any = this.form.get(inputNome);
    return campo && campo.touched && campo.invalid;
  }

  marcarCamposVazios(){
    Object.values(this.form.controls).forEach(campo => {
      campo.markAsTouched();
    });
  }

  listarProjetos(option: string): void {
    this.activeOption = option;
    localStorage.setItem('activeOption', option);

    switch (option) {
      case 'oldest':
        this.listarProjetosOldest();
        break;
      case 'newest':
        this.listarProjetosNewest();
        break;
      case 'completed-oldest':
        this.listarProjetosCompletosOldest();
        break;
      case 'completed-newest':
        this.listarProjetosCompletosNewest();
        break;
    }
  }

  listarProjetosOldest() {
    this.projetoService.buscarProjetos().then(resposta => {
      this.projetos = resposta;
    })
  }

  listarProjetosNewest() {
    this.projetoService.buscarProjetos().then(resposta => {
      this.projetos = resposta.reverse(); // Inverte a ordem dos projetos
    });
  }

  listarProjetosCompletosOldest(): void {
    this.projetoService.buscarProjetos().then(resposta => {
      this.projetos = resposta.sort((a, b) => {
        if (a.anoConclusao !== b.anoConclusao) {
          return a.anoConclusao - b.anoConclusao;
        } else {
          return a.semestreConclusao - b.semestreConclusao;
        }
      });
    });
  }

  listarProjetosCompletosNewest(): void {
    this.projetoService.buscarProjetos().then(resposta => {
      this.projetos = resposta.sort((a, b) => {
        if (a.anoConclusao !== b.anoConclusao) {
          return b.anoConclusao - a.anoConclusao;
        } else {
          return b.semestreConclusao - a.semestreConclusao;
        }
      });
    });
  }

  excluir(id:number){
    Swal.fire(
      {
        title: 'Você está certo disso?',
        text: 'Esta ação não podera ser desfeita.',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, deletar projeto',
        confirmButtonColor: '#3085d6',
        cancelButtonText: 'Cancelar',
      }).then((tipoBotao)=> {
      if(tipoBotao.isConfirmed){
        this.projetoService.removerProjeto(id).then(()=>{
          Swal.fire('Deletado', 'O projeto foi deletado.', 'success');
          this.listarProjetos(this.activeOption);
        });
      }
    }).catch(error => {
      console.log(error);
      Swal.fire('ERRO', 'O projeto não foi deletado.', 'error');
    });
  }

  carregarInfoProjeto(projetoEditar: ProjetoInfo){
    this.form.patchValue({
      tituloProjeto: projetoEditar.titulo,
      autorProjeto: projetoEditar.autor,
      anoConclusaoProjeto: projetoEditar.anoConclusao,
      semestreConclusaoProjeto: projetoEditar.semestreConclusao,
      linkFigmaProjeto: projetoEditar.linkFigma,
      linkYoutubeProjeto: projetoEditar.linkYoutube,
      relatorioProjeto: projetoEditar.relatorio,
      thumbnailProjeto: projetoEditar.thumbnail,
      id: projetoEditar.id
    });
    this.openModal();
    console.log('Dados do projeto ', projetoEditar);
  }

  editarProjeto(){
    if(this.form.valid){
      // Define o caminho da imagem padrão
      const defaultThumbnail = '../../../assets/test.png';
      // Verifica se a thumbnail está preenchida, caso contrário, atribui a imagem padrão
      const thumbnailProjeto = this.form.value.thumbnailProjeto ? this.form.value.thumbnailProjeto : defaultThumbnail;

      const editarProjeto: ProjetoInfo = new ProjetoInfo(
        this.form.value.tituloProjeto,
        this.form.value.autorProjeto,
        this.form.value.anoConclusaoProjeto,
        this.form.value.semestreConclusaoProjeto,
        this.form.value.linkFigmaProjeto,
        this.form.value.linkYoutubeProjeto,
        this.form.value.relatorioProjeto,
        thumbnailProjeto,
        this.form.value.id,
      );
      this.projetoService.atualizarProjeto(this.form.value.id, editarProjeto)
        .then(reposta => {
          if(reposta === 1){
            Swal.fire('Pronto!','Projeto editado com sucesso.','success');
            this.form.reset();
            this.closeModal();
            this.listarProjetos(this.activeOption);
          }else{
            Swal.fire('Atenção','Nenhum projeto encontrado, ou nenhuma alteração necessária', 'info');
          }
        }).catch(error => {
        Swal.fire('Atenção!', 'Não foi possível editar o projeto.', 'error');
      });
    }else{
      Swal.fire('Atenção!', 'Alguns campos estão incorretos', 'warning');
      this.marcarCamposVazios();
    }
  }

  onFileChangeImage(event: any){
    const file = event.target.files[0];
    if(file){
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        this.form.patchValue({thumbnailProjeto: loadEvent?.target?.result});
      };
      reader.readAsDataURL(file);
    }
  }

  onFileChangePDF(event: any){
    const file = event.target.files[0];
    if(file){
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        this.form.patchValue({relatorioProjeto: loadEvent?.target?.result});
      };
      reader.readAsDataURL(file);
    }
  }

  ngOnInit(): void {
    this.activeOption = localStorage.getItem('activeOption') || 'oldest';
    this.listarProjetos(this.activeOption);
  }
}
