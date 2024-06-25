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

  form: FormGroup;
  projetos: any [] = [];
  constructor( private projetoService: ProjetosService,
               private fb: FormBuilder) {

    this.form =  this.fb.group ({
      tituloProjeto: ['', Validators.required],
      autorProjeto: ['', Validators.required],
      anoConclusaoProjeto: ['', Validators.required],
      semestreConclusaoProjeto: ['', Validators.required],
      // linkFigmaProjeto: [''],
      // linkYoutubeProjeto: [''],
      // relatorioProjeto: [''],
      thumbnailProjeto: [''],
    })
  }

  openModal(){
    $('#add-projeto').modal('show');
  }
  closeModal(){
    $('#add-projeto').modal('hide');
  }

  salvarFormProjeto() {
    if (this.form.valid){
      const novoProjeto: ProjetoInfo = new ProjetoInfo(
        this.form.value.tituloProjeto,
        this.form.value.autorProjeto,
        this.form.value.anoConclusaoProjeto,
        this.form.value.semestreConclusaoProjeto,
        // this.form.value.linkFigmaProjeto,
        // this.form.value.linkYoutubeProjeto,
        // this.form.value.relatorioProjeto,
        this.form.value.thumbnailProjeto
      );
      console.log('Dados do projeto adicionado', novoProjeto)
      this.projetoService.adicionarProjeto(novoProjeto).then(resposta =>{
        if (resposta > 0){
          Swal.fire('Pronto!', 'Projeto salvo.', 'success');
          this.form.reset();
          this.closeModal();
          this.listarProjetos();
        }
      }).catch(respostaError => {
        Swal.fire('Não foi dessa vez', 'Não foi possível salvar a tarefa, ' +
          'tente novamente mais tarde', 'error');
        console.log(respostaError);
      })
    }else {
      console.log("CAMPOS INVALIDOS ENCONTRADOS.");
      this.marcarCamposVazios();
      console.log("DADOS DOS CAMPOS: ", this.form.value);
      console.log(this.base64string);
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

  listarProjetos() {
    this.projetoService.buscarProjetos().then(resposta => {
      this.projetos = resposta;
    })
  }

  excluirTarefa(id:number){
    Swal.fire(
      {
        title: 'Você está certo disso?',
        text: 'Esta ação não podera ser desfeita.',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonColor: '#d33',
        confirmButtonText: 'sim, deletar projeto',
        confirmButtonColor: '#3085d6'
      }).then((tipoBotao)=> {
      if(tipoBotao.isConfirmed){
        this.projetoService.removerProjeto(id).then(()=>{
          Swal.fire('Deletado', 'O projeto foi deletado.', 'success');
          this.listarProjetos();
        });
      }
    }).catch(error => {
      console.log(error);
      Swal.fire('ERRO', 'O projeto não foi deletado.', 'error');
    });
  }

  base64string: string = '';

  onFileSelected(event: Event) {
    const input= event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.base64string = reader.result as string;
      };

      reader.readAsDataURL(file);
    }
  }

  ngOnInit(): void {
    this.listarProjetos();
  }
}
