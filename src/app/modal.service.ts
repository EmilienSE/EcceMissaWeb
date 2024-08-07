import { ApplicationRef, ComponentRef, EnvironmentInjector, Injectable, TemplateRef, Type, ViewContainerRef, createComponent } from "@angular/core";
import { ModalComponent } from "./modal/modal.component";
import { Options } from "./modal/modal-options";

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  // Create a reference to our modal component
  newModalComponent!: ComponentRef<ModalComponent>;
  // Optional content passed at the creation : animation, size, ... 
  options!: Options | undefined;
  data!: any;

  constructor(
    private appRef: ApplicationRef,
    private injector: EnvironmentInjector
  ) {}

  // Signature of the second approach
  open<C>(vcrOrComponent: Type<C>, options?: Options, data?: any): void;

  // Function implementation
  open<C>(
    vcrOrComponent: Type<C>,
    options?: Options,
    data?: any
  ) {
    // Pour la seconde approche
    this.openWithComponent(vcrOrComponent, options, data);
    this.options = options as Options | undefined;
    this.data = data;
  }

  private openWithComponent(component: Type<unknown>, options?: Options, data?: any) {
    // create the desired component, the content of the modal box
    const newComponent = createComponent(component, {
      environmentInjector: this.injector,
    });
    // create the modal component and project the instance of the desired component in the ng-content
    this.newModalComponent = createComponent(ModalComponent, {
      environmentInjector: this.injector,
      projectableNodes: [[newComponent.location.nativeElement]],
    });

    document.body.appendChild(this.newModalComponent.location.nativeElement);

    this.newModalComponent.instance.data = data;

    // Attach views to the changeDetection cycle
    this.appRef.attachView(newComponent.hostView);
    this.appRef.attachView(this.newModalComponent.hostView);
  }

  close() {
    this.newModalComponent.instance.close();
  }
}