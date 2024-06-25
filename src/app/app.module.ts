import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {AppRoutingModule} from "./app-routing.module";

import { AppComponent } from './app.component';
import { CabecalhoComponent } from './Componentes/cabecalho/cabecalho.component';
import { RodapeComponent } from './Componentes/rodape/rodape.component';
import { PaginaInicialComponent } from './Componentes/pagina-inicial/pagina-inicial.component';
import { EditarProjetosComponent } from './Componentes/editar-projetos/editar-projetos.component';
import { ListarProjetosComponent } from './Componentes/listar-projetos/listar-projetos.component';
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    CabecalhoComponent,
    RodapeComponent,
    PaginaInicialComponent,
    EditarProjetosComponent,
    ListarProjetosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
