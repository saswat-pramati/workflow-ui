export interface IDraggableControl {
  onSelect(event: any): void;
  dragStart(event: any): void;
  drag(event: any): void;
  dragEnd(): void;
}
