import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import IClip from '../../models/clip.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClipService } from '../../services/clip.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {
  @Input() activeClip: IClip | null = null;
  @Output() update = new EventEmitter();

  inSubmission: boolean = false;
  showAlert: boolean = false;
  alertColor: string = 'blue';
  alertMessage: string = 'Please Wait! Updating Clip';

  clipID = new FormControl('', {
    nonNullable: true
  });
  title = new FormControl('', {
    validators: [
      Validators.required,
      Validators.minLength(3)
    ],
    nonNullable: true
  });
  editForm = new FormGroup({
    title: this.title,
    id: this.clipID
  });

  constructor(private modal: ModalService, private clipService: ClipService) { }

  ngOnChanges(): void {
    if (!this.activeClip) {
      return;
    }

    this.inSubmission = false;
    this.showAlert = false;
    this.clipID.setValue(this.activeClip.docID as string);
    this.title.setValue(this.activeClip.title);
  }

  ngOnInit(): void {
    this.modal.register('editClip');
  }

  ngOnDestroy(): void {
    this.modal.unregister('editClip');
  }

  async submit(): Promise<void> {
    if (!this.activeClip) {
      return;
    }
    this.inSubmission = true;
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMessage = 'Please Wait! Updating Clip';

    try {
      await this.clipService.updateClip(
        this.clipID.value,
        this.title.value
      );
    }
    catch (e) {
      this.inSubmission = false;
      this.alertColor = 'red';
      this.alertMessage = 'Something went wrong. Try again later.'
      return;
    }

    this.activeClip.title = this.title.value
    this.update.emit(this.activeClip);

    this.inSubmission = false;
    this.alertColor = 'green';
    this.alertMessage = 'Success!';
  }
}
