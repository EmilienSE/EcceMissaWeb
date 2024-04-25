import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FeuilletsComponent } from './home/feuillets/feuillets.component';
import { DioceseComponent } from './home/diocese/diocese.component';
import { ParoisseComponent } from './home/paroisse/paroisse.component';
import { CompteComponent } from './home/compte/compte.component';

export const routes: Routes = [
    { 
        path: 'accueil', 
        component: HomeComponent,
        children: [
            {
                path: 'feuillets',
                component: FeuilletsComponent
            },
            {
                path: 'diocese',
                component: DioceseComponent
            },
            {
                path: 'paroisse',
                component: ParoisseComponent
            },
            {
                path: 'compte',
                component: CompteComponent
            },
        ] 
    },
    { path: 'connexion', component: HomeComponent }
];
