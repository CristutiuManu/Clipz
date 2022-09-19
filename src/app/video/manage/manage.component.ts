import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ClipService } from '../../services/clip.service';
import IClip from '../../models/clip.model';
import { ModalService } from '../../services/modal.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {
  videoOrder = '1';
  clips: IClip[] = [];
  activeClip: IClip | null = null;
  sort$: BehaviorSubject<string>;


  constructor(private router: Router,
    private route: ActivatedRoute,
    private clipService: ClipService,
    private modal: ModalService
  ) {
    this.sort$ = new BehaviorSubject<string>(this.videoOrder);
  }

  ngOnInit(): void {
    //this.navigateWithSort(this.videoOrder);

    this.route.queryParamMap.subscribe((params: Params) => {
      this.videoOrder = params.get('sort') === '2'!! ? params.get('sort') : '1'
      //this.navigateWithSort(this.videoOrder);
      this.sort$.next(this.videoOrder);
    });
    this.clipService.getUsersClips(this.sort$).subscribe(docs => {
      this.clips = [];

      docs.forEach(doc => {
        this.clips.push({
          docID: doc.id,
          ...doc.data()
        })
      });
    });
  }

  navigateWithSort(videoOrder: string) {
    this.router.navigate([], {
      queryParams: { sort: videoOrder }
    })
  }

  sort(event: Event) {
    const { value } = (event.target as HTMLSelectElement);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort: value
      }
    });
  }

  openModal($event: Event, clip: IClip) {
    $event.preventDefault();

    this.activeClip = clip;

    this.modal.toggleModal('editClip');
  }

  update($event: IClip) {
    this.clips.forEach((element, index) => {
      if (element.docID === $event.docID) {
        this.clips[index].title = $event.title;
      }
    })
  }

  deleteClip($event: Event, clip: IClip) {
    $event.preventDefault();

    this.clipService.deleteClip(clip);

    this.clips.forEach((element, index) => {
      if (element.docID === clip.docID) {
        this.clips.splice(index, 1);
      }
    })
  }
}
