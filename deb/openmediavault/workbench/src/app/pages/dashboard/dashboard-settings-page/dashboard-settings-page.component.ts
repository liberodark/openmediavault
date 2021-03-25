import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';

import { DashboardWidgetConfig } from '~/app/core/components/dashboard/models/dashboard-widget-config.model';
import { DashboardWidgetConfigService } from '~/app/core/services/dashboard-widget-config.service';
import { Icon } from '~/app/shared/enum/icon.enum';

@Component({
  templateUrl: './dashboard-settings-page.component.html',
  styleUrls: ['./dashboard-settings-page.component.scss']
})
export class DashboardSettingsPageComponent implements OnInit {
  public error: HttpErrorResponse;
  public available: Array<DashboardWidgetConfig> = [];
  public enabled: Array<DashboardWidgetConfig> = [];
  public icon = Icon;

  constructor(
    private dashboardWidgetConfigService: DashboardWidgetConfigService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.dashboardWidgetConfigService.configs$.subscribe(
      (widgets: Array<DashboardWidgetConfig>) => {
        const enabledWidgets: Array<string> = this.dashboardWidgetConfigService.getEnabled();
        _.forEach(widgets, (widget: DashboardWidgetConfig) => {
          if (enabledWidgets.includes(widget.id)) {
            this.enabled.push(widget);
          } else {
            this.available.push(widget);
          }
        });
      }
    );
  }

  onDrop(event: CdkDragDrop<DashboardWidgetConfig[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  onEnabledPull(widget: DashboardWidgetConfig) {
    transferArrayItem(
      this.enabled,
      this.available,
      _.findIndex(this.enabled, ['id', widget.id]),
      this.available.length + 1
    );
  }

  onEnabledPush(widget: DashboardWidgetConfig) {
    transferArrayItem(
      this.available,
      this.enabled,
      _.findIndex(this.available, ['id', widget.id]),
      this.enabled.length + 1
    );
  }

  onSubmit() {
    const enabledWidgets: Array<string> = _.map(this.enabled, 'id');
    this.dashboardWidgetConfigService.setEnabled(enabledWidgets);
    this.router.navigate(['/dashboard']);
  }
}
