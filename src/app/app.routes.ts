import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FeuilletsComponent } from './home/feuillets/feuillets.component';
import { DioceseComponent } from './home/diocese/diocese.component';
import { ParoisseComponent } from './home/paroisse/paroisse.component';
import { CompteComponent } from './home/compte/compte.component';
import { ConnexionComponent } from './connexion/connexion.component';
import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
    { 
        path: '', 
        component: HomeComponent,
        canActivate: [authGuard],
        children: [
            {
                path: '',
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
    { path: 'connexion', component: ConnexionComponent }
];
