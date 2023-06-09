import { Component, OnInit } from '@angular/core';
import { EnvironmentService } from 'projects/common/src/app/services/environment.service';

@Component({
  selector: 'modern-developer-api-page',
  templateUrl: './developer-api-page.component.html',
  styleUrls: ['./developer-api-page.component.scss']
})
export class DeveloperApiPageComponent implements OnInit {

  swagger_ui_page: string = '';

  constructor(
    private environmentService: EnvironmentService
  ) {
    this.swagger_ui_page = this.environmentService.API_DOMAIN + `/swagger-ui-docs`;
  }

  ngOnInit(): void {
  }

}
