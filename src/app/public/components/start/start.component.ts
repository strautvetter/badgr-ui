import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../../common/services/session.service';

@Component({
	selector: 'app-start',
	templateUrl: './start.component.html',
	styleUrls: ['./start.component.scss'],
	standalone: false,
})
export class StartComponent implements OnInit {
	constructor(public sessionService: SessionService) {}
	public loggedIn = false;
	thumbnailSrc: string = '../../../../../assets/videos/thumbnail.svg';
	videoStarted = false;

	ngOnInit() {
		this.loggedIn = this.sessionService.isLoggedIn;
	}

	startVideo() {
		this.videoStarted = true;
		(document.getElementById('video-iframe') as HTMLIFrameElement).src =
			'https://www.youtube.com/embed/KZqY_jY4ZD4?autoplay=1';
	}
}
