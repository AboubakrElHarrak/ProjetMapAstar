import { NgModule, InjectionToken } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapManagerComponent, Map_Node } from './map-manager/map-manager.component';



export const g = new InjectionToken<number>('g');
export const f = new InjectionToken<number>('f');
export const parent = new InjectionToken<Map_Node>('parent');
@NgModule({
  declarations: [
    AppComponent,
    MapManagerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    { provide: g, useValue: 0 },
    { provide: f, useValue: 0 },
    { provide: parent, useValue: null },

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
