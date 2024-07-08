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

  //Abrir e fechar o modal
  openModal(){
    $('#add-projeto').modal('show');
  }
  closeModal(){
    $('#add-projeto').modal('hide');
  }

  //Verifica se o conteudo do modal é referente a um projeto novo ou ediçao de um projeto já registrado e executa o método adequada
  submitForm(){
    if(this.form.value.id > 0){
      this.editarProjeto();
    }else{
      this.salvarFormProjeto();
    }
  }

  //salva o formulario de projeto
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

  //verifica e salva a ultima opcao de ordem de listagem deporjetos
  listarProjetos(option: string): void {
    this.activeOption = option; // Define a opção ativa com o valor fornecido como argumento.
    localStorage.setItem('activeOption', option); // Armazena a opção ativa no localStorage.

    // Verifica o valor da opção e chama o método correspondente.
    switch (option) {
      case 'oldest':
        this.listarProjetosOldest(); // Chama o método para listar os projetos mais antigos.
        break;
      case 'newest':
        this.listarProjetosNewest(); // Chama o método para listar os projetos mais recentes.
        break;
      case 'completed-oldest':
        this.listarProjetosCompletosOldest(); // Chama o método para listar os projetos completos mais antigos.
        break;
      case 'completed-newest':
        this.listarProjetosCompletosNewest(); // Chama o método para listar os projetos completos mais recentes.
        break;
    }
  }

  //lista os projetos a partir do adicionado a mais tempo (visualizacao padrao)
  listarProjetosOldest() {
    this.projetoService.buscarProjetos().then(resposta => {
      this.projetos = resposta;
    })
  }

  //lista os projetos a partir do adicionado mais recentemente
  listarProjetosNewest() {
    this.projetoService.buscarProjetos().then(resposta => {
      this.projetos = resposta.reverse(); // Inverte a ordem dos projetos
    });
  }

  //lista os projetos a partir da data de conclusao mais antiga
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

  //lista os projetos a partir da data de conclusao mais recente
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

  //executa o serviço para excluir projetos
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

  //Carrega e mostra as informaçoes de um projeto em um modal para ediçao
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

  //sobreescreve dados de um projeto ja existente
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

  //Salva arquivos de imagem em base64
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

  //Salva .pdf de imagem em base64
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

  //Verifica qual o metodo de ordenacao escolhido e executa a listagem dos projetos
  ngOnInit(): void {
    this.activeOption = localStorage.getItem('activeOption') || 'oldest';
    this.listarProjetos(this.activeOption);
  }
}
