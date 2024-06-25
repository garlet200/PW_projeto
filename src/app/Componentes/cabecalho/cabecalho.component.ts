import { Component, OnInit } from '@angular/core';
import {EditarProjetosComponent} from "../editar-projetos/editar-projetos.component";

@Component({
  selector: 'app-cabecalho',
  templateUrl: './cabecalho.component.html',
  styleUrls: ['./cabecalho.component.css']
})
export class CabecalhoComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

    protected readonly EditarProjetosComponent = EditarProjetosComponent;
}
