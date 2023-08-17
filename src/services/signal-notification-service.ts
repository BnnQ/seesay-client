import { INotificationService } from './abstractions/i-notification-service';
import { Injectable } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from '@microsoft/signalr';
import { environment } from '../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class SignalNotificationService implements INotificationService {
  private connection?: HubConnection;
  constructor(private readonly toastService: ToastrService) {}

  private async connect(): Promise<void> {
    this.connection = new HubConnectionBuilder()
      .withUrl(environment.azureFunctionApiUrl)
      .configureLogging(
        environment.production ? LogLevel.Error : LogLevel.Information
      )
      .build();

    if (environment.production) {
      await this.connection.start();
    } else {
      await this.connection
        .start()
        .then(() =>
          console.log('Successfully established connection with SignalR hub')
        )
        .catch((err) =>
          console.log(
            'Failed to establish connection with SignalR service: ' + err
          )
        );

      this.connection.on('processing_start', (message) =>
        this.toastService.info(message)
      );
      this.connection.on('processing_finish', (message) =>
        this.toastService.info(message)
      );
      this.connection.on('error_external', (message) =>
        this.toastService.error(message)
      );
    }
  }

  private async ensureConnection(): Promise<void> {
    if (
      !this.connection ||
      this.connection.state !== HubConnectionState.Connected
    )
      await this.connect();
  }

  async getSelfConnectionId(): Promise<string> {
    await this.ensureConnection();

    return this.connection!.connectionId!;
  }

  async on(
    methodName: string,
    handler: (...args: any[]) => any
  ): Promise<void> {
    await this.ensureConnection();

    this.connection!.on(methodName, handler);
  }
}
