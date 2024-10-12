import { NgModule } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import {MatRadioModule} from '@angular/material/radio';
import { MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatPaginatorModule} from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {  MatButtonModule, MatIconButton } from '@angular/material/button';
import {   MatIconModule } from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'; // Asegúrate de importar esto también
import { MatDividerModule } from '@angular/material/divider';  // Importa este módulo
import { MatListModule } from '@angular/material/list';        // Importa este módulo

@NgModule({
  exports: [
    MatInputModule,
    MatCardModule,
    MatRadioModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatToolbarModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatNativeDateModule, // Agrega este módulo
    MatDividerModule,   // Añadir MatDividerModule
    MatListModule,      // Añadir MatListModule
  ]
})
export class MaterialModule { }
