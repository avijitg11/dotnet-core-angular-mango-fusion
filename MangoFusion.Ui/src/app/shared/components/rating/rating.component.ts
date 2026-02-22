import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-rating',
  standalone: true,
  templateUrl: './rating.component.html'
})
export class RatingComponent {
    max = input<number>(5);
    value = input<number>(0);
    disabled = input<boolean>(false);
    valueChange = output<number>();

    stars = computed(() =>
        Array.from({ length: this.max() })
    );

    rate(index: number) {
        if (this.disabled()) return;
        this.valueChange.emit(index + 1);
    }
}