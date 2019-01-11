import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { ActivityComponent } from './activity/activity.component';
import { ConditionComponent } from './condition/condition.component';
import { StartendComponent } from './startend/startend.component';
import { NavbarComponent } from './navbar/navbar.component';
import { CodepannelComponent } from './codepannel/codepannel.component';
import { TwodimensionArrowComponent } from './twodimension-arrow/twodimension-arrow.component';
import { TemplateComponent } from './template/template.component';
import { ComponentSelectorComponent } from './component-selector/component-selector.component';
import { ControlBarComponent } from './control-bar/control-bar.component';
import { PropertyBarComponent } from './property-bar/property-bar.component';
import { LinkBarComponent } from './link-bar/link-bar.component';
import { ActionBarComponent } from './action-bar/action-bar.component';
import { UnderConstructionComponent } from './under-construction/under-construction.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { Keys } from './pipes/Keys';
import { VirtualArrowComponent } from './virtual-arrow/virtual-arrow.component';
import { SubactionComponent } from './subaction/subaction.component';
import { ConnectorComponent } from './connector/connector.component';
import { ReceiverComponent } from './receiver/receiver.component';
import { ShContextMenuModule } from 'context-menu-angular6';

const routes = [{
  path: '',
  component: TemplateComponent
},
{
  path: 'template',
  component: TemplateComponent
}];

@NgModule({
  declarations: [
    AppComponent,
    ActivityComponent,
    ConditionComponent,
    StartendComponent,
    NavbarComponent,
    CodepannelComponent,
    TwodimensionArrowComponent,
    TemplateComponent,
    ComponentSelectorComponent,
    ControlBarComponent,
    PropertyBarComponent,
    LinkBarComponent,
    ActionBarComponent,
    UnderConstructionComponent,
    Keys,
    VirtualArrowComponent,
    SubactionComponent,
    ConnectorComponent,
    ReceiverComponent
  ],
  imports: [
  BrowserModule,
    FormsModule,
    HttpClientModule,
    ModalModule.forRoot(),
    RouterModule.forRoot(routes),
    ShContextMenuModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
