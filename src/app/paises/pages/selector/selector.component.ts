/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { switchMap, tap } from 'rxjs/operators'

import { PaisesService } from '../../services/paises.service'
import { PaisSmall } from '../../interfaces/paises.interface'

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styles: []
})
export class SelectorComponent implements OnInit {
  miFormulario: FormGroup = this.fb.group({
    region: ['', Validators.required],
    pais: ['', Validators.required],
    frontera: ['', Validators.required]
  })

  // Llenar selectores
  regiones: string[] = []
  paises: PaisSmall[] = []
  // fronteras: string[] = []
  fronteras: PaisSmall[] = []

  // UI
  cargando: boolean = false

  constructor (
    private readonly fb: FormBuilder,
    private readonly paisesService: PaisesService
  ) { }

  ngOnInit (): void {
    this.regiones = this.paisesService.regiones

    // Cuando cambie la region
    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap((_) => {
          this.miFormulario.get('pais')?.reset('')
          this.cargando = true
        }),
        switchMap(region => (this.paisesService.getPaisesByRegion(region)))
      )
      .subscribe(paises => {
        this.paises = paises
        this.cargando = false
      })

    // Cuando cambia el pais
    this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap(() => {
          this.miFormulario.get('frontera')?.reset('')
          this.cargando = true
        }),
        switchMap(codigo => (this.paisesService.getPaisesByCode(codigo))),
        switchMap(pais => (this.paisesService.getCodesFronterasByPais(pais?.borders ? pais?.borders : [])))
      )
      .subscribe(paises => {
        this.fronteras = paises
        this.cargando = false
      })
  }

  guardar (): void {
    console.log(this.miFormulario.value)
  }
}
