import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { combineLatest, Observable, of } from 'rxjs'
import { PaisSmall, Pais } from '../interfaces/paises.interface'

@Injectable({
  providedIn: 'root'
})
export class PaisesService {
  private readonly baseUrl: string = 'https://restcountries.com/v2'
  private readonly _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania']

  public get regiones (): string[] {
    return [...this._regiones]
  }

  constructor (private readonly http: HttpClient) { }

  getPaisesByRegion (region: string): Observable<PaisSmall[]> {
    const url: string = `${this.baseUrl}/continent/${region}?fields=alpha3Code,name`
    return this.http.get<PaisSmall[]>(url)
  }

  getPaisesByCode (codigo: string): Observable<Pais | null> {
    if (codigo === '') return of(null)

    const url: string = `${this.baseUrl}/alpha/${codigo}`
    return this.http.get<Pais>(url)
  }

  getPaisesByCodeSmall (codigo: string): Observable<PaisSmall> {
    const url: string = `${this.baseUrl}/alpha/${codigo}?fields=alpha3Code,name`
    return this.http.get<PaisSmall>(url)
  }

  getCodesFronterasByPais (borders: string[]): Observable<PaisSmall[]> {
    if (borders === []) return of([])

    const peticiones: Array<Observable<PaisSmall>> = []

    borders.forEach(codigo => {
      const peticion = this.getPaisesByCodeSmall(codigo)
      peticiones.push(peticion)
    })

    return combineLatest(peticiones)
  }
}
