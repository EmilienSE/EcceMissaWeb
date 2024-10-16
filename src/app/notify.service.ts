import { ApplicationRef, ComponentRef, EnvironmentInjector, Injectable, Type, createComponent } from "@angular/core";
import { NotifyComponent } from "./notify/notify.component";
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class NotifyService {
  private newNotifyComponent!: ComponentRef<NotifyComponent>;
  private closePromiseResolve!: (value?: any) => void;

  constructor(
    private appRef: ApplicationRef,
    private injector: EnvironmentInjector
  ) {}

  open(message: string, type: 'success' | 'danger', duration: number = 3000): Promise<void> {
    return new Promise<void>((resolve) => {
      this.closePromiseResolve = resolve;
      this.openNotifyComponent(message, type, duration);
    });
  }

  private openNotifyComponent(message: string, type: 'success' | 'danger', duration: number) {
    this.newNotifyComponent = createComponent(NotifyComponent, {
      environmentInjector: this.injector,
    });

    this.newNotifyComponent.instance.message = message;
    this.newNotifyComponent.instance.type = type;

    // Ajoutez le composant à l'élément du DOM
    document.body.appendChild(this.newNotifyComponent.location.nativeElement);

    // Attacher la vue au cycle de détection de changement
    this.appRef.attachView(this.newNotifyComponent.hostView);

    // Fermer la notification après la durée spécifiée
    setTimeout(() => {
      this.close();
    }, duration);
  }

  close() {
    if (this.newNotifyComponent) {
      this.newNotifyComponent.instance.close();
      document.body.removeChild(this.newNotifyComponent.location.nativeElement);
      this.appRef.detachView(this.newNotifyComponent.hostView);
      this.closePromiseResolve(); // Résoudre la promesse
    }
  }
}
