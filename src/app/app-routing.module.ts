import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {EditarProjetosComponent} from "./Componentes/editar-projetos/editar-projetos.component"
import {PaginaInicialComponent} from  "./Componentes/pagina-inicial/pagina-inicial.component"
import { SobreComponent } from "./Componentes/sobre/sobre.component"


const routes: Routes = [
  { path: "", redirectTo: "pagina-inicial", pathMatch: "full" },
  { path: "pagina-inicial", component: PaginaInicialComponent },
  { path: "editar-projeto", component: EditarProjetosComponent },
  { path: "sobre-projetos", component: SobreComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

