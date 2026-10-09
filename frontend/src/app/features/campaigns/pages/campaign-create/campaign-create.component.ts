import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { EmailPreviewComponent } from '../../components/email-preview/email-preview.component';
import { CampaignSubmission } from '../../models/campaign-submission.model';
import { CreateCampaignPayload } from '../../models/create-campaign.model';
import { CampaignService } from '../../services/campaign.service';
import { extractFieldErrors, FieldError } from '../../utils/validation-errors';
import { recipientEmailsValidator } from '../../validators/recipient-emails.validator';

@Component({
  selector: 'app-campaign-create',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, EmailPreviewComponent],
  templateUrl: './campaign-create.component.html',
})
export class CampaignCreateComponent {
  private readonly campaignService = inject(CampaignService);

  readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(255)],
    }),
    subject: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(255)],
    }),
    body: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(10000)],
    }),
    recipientEmails: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, recipientEmailsValidator()],
    }),
  });

  readonly submitting = signal(false);
  readonly submission = signal<CampaignSubmission | null>(null);
  readonly serverErrors = signal<FieldError[]>([]);

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    const payload: CreateCampaignPayload = {
      name: value.name.trim(),
      subject: value.subject.trim(),
      body: value.body.trim(),
      recipient_emails: this.parseRecipients(value.recipientEmails),
    };

    this.submitting.set(true);
    this.submission.set(null);
    this.serverErrors.set([]);

    this.campaignService.create(payload).subscribe({
      next: (result) => {
        this.submission.set(result);
        this.form.reset();
        this.submitting.set(false);
      },
      error: (error) => {
        this.serverErrors.set(extractFieldErrors(error));
        this.submitting.set(false);
      },
    });
  }

  private parseRecipients(raw: string): string[] {
    return raw
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  }
}
