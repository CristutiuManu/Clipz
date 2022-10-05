import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AboutComponent } from './about.component';

describe('About Componenet', () => {
    let fixture: ComponentFixture<AboutComponent>;
    let component: AboutComponent;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            declarations: [AboutComponent], 
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AboutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    })
});