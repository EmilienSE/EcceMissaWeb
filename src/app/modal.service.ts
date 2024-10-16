import { ApplicationRef, ComponentRef, EnvironmentInjector, Injectable, TemplateRef, Type, ViewContainerRef, createComponent } from "@angular/core";
import { ModalComponent } from "./modal/modal.component";
import { Options } from "./modal/modal-options";
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  newModalComponent!: ComponentRef<ModalComponent>;
  options!: Options | undefined;
  data!: any;
  private closePromiseResolve!: (value?: any) => void; 

  constructor(
    private appRef: ApplicationRef,
    private injector: EnvironmentInjector
  ) {}

  open<C>(vcrOrComponent: Type<C>, options?: Options, data?: any): { closed: Subject<void>, promise: Promise<void> } {
    const closedSubject = new Subject<void>(); // Création d'un Subject
    this.openWithComponent(vcrOrComponent, options, data);
    this.options = options as Options | undefined;
    this.data = data;

    // Retourner l'objet avec le Subject et la Promise
    return {
      closed: closedSubject,
      promise: new Promise<void>((resolve) => {  // Spécifier Promise<void>
        this.closePromiseResolve = () => {
          closedSubject.next(); // Émet un événement de fermeture
          closedSubject.complete(); // Termine le Subject
          resolve(); // Résoudre la promesse
        };
      })
    };
  }

  private openWithComponent(component: Type<unknown>, options?: Options, data?: any) {
    const newComponent = createComponent(component, {
      environmentInjector: this.injector,
    });

    this.newModalComponent = createComponent(ModalComponent, {
      environmentInjector: this.injector,
      projectableNodes: [[newComponent.location.nativeElement]],
    });

    document.body.appendChild(this.newModalComponent.location.nativeElement);
    this.newModalComponent.instance.data = data;

    // Attach views to the changeDetection cycle
    this.appRef.attachView(newComponent.hostView);
    this.appRef.attachView(this.newModalComponent.hostView);

    this.newModalComponent.instance.closed.subscribe(() => this.closePromiseResolve());
  }

  close() {
    if (this.newModalComponent) {
      this.newModalComponent.instance.close();
      document.body.removeChild(this.newModalComponent.location.nativeElement);
      this.appRef.detachView(this.newModalComponent.hostView);
    }
  }
}
