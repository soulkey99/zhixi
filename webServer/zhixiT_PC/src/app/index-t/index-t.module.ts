import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }   from '@angular/forms';

import { IndexTComponent }    from './index-t.component';
import { HeaderComponent }    from '../header/header.component';

import { IndexTRoutingModule } from './index-t-routing.module';
import { MdlModule } from 'angular2-mdl';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IndexTRoutingModule,
    MdlModule
  ],
  declarations: [
    IndexTComponent,
    HeaderComponent
  ],
  providers: [
      
  ],
  entryComponents: [
  ],
})
export class IndexTModule {}