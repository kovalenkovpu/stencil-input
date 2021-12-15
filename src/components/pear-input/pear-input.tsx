import { Component, Prop, State, Watch, Element, Host, h } from '@stencil/core';

@Component({
  tag: 'pear-input',
  styleUrl: 'pear-input.scss',
  shadow: true,
})
export class PearInput {
  protected errorIcon = 
    <svg
      class="input-error-icon"
      width="17"
      height="16"
      viewBox="0 0 17 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M8.33325 16C12.7515 16 16.3333 12.4183 16.3333 8C16.3333 3.58172 12.7515 0 8.33325 0C3.91497 0 0.333252 3.58172 0.333252 8C0.333252 12.4183 3.91497 16 8.33325 16ZM9.33325 5C9.33325 5.55228 8.88554 6 8.33325 6C7.78097 6 7.33325 5.55228 7.33325 5C7.33325 4.44772 7.78097 4 8.33325 4C8.88554 4 9.33325 4.44772 9.33325 5ZM8.33325 7C8.88554 7 9.33325 7.44772 9.33325 8V11C9.33325 11.5523 8.88554 12 8.33325 12C7.78097 12 7.33325 11.5523 7.33325 11V8C7.33325 7.44772 7.78097 7 8.33325 7Z"
      />
    </svg>;

  @Element() el: HTMLElement;
  
  @State() private placeholderText = '';

  @Prop() label = '';

  @Prop({ mutable: true }) floatLabel = false;
  
  @Prop({ mutable: true }) focused = false;
  
  @Prop({ mutable: true }) labelFor = '';
  
  @Prop() disabled = false;
  
  @Prop() hasError = false;
  
  @Watch('floatLabel')
  watchFloatLabelChange() {
    this.inputItem.setAttribute('placeholder', this.floatLabel ? this.placeholderText : '');
  }

  private get inputItem() {
    return this.el.querySelector('input');
  }

  protected componentWillLoad() {
    this.labelFor = this.inputItem.name;
    this.placeholderText = this.inputItem.placeholder;

    this.inputItem.disabled = this.disabled;
    this.inputItem.setAttribute('aria-disabled', `${this.disabled}`);
    this.inputItem.setAttribute('placeholder', '');
    this.inputItem.setAttribute('aria-label', `${this.label}`);
    this.inputItem.setAttribute('aria-invalid', `${this.hasError}`);

    if (this.inputItem.value) {
      this.floatLabel = true;
    }
  }

  protected render() {
    return (
      <Host
        focused={this.focused}
        onClick={this._focusInput}
        floatLabel={this.floatLabel}
        onFocusin={this._floatingLabel}
        onFocusout={this._floatingLabel}
      >
        <div
          class="pear-input-wrapper"
        >
          <label
            class="pear-input-label"
            htmlFor={this.labelFor}
          >
            {this.label}
          </label>
          {this.errorIcon}
          <slot></slot>
        </div>
      </Host>
    );
  }

  private _focusInput = () => {
    if (!this.focused) {
      this.inputItem.focus();
    }
  }

  private _floatingLabel = (e: Event) => {
    if (!this.inputItem.value) {
      this.floatLabel = !this.floatLabel;
    }

    this.focused = e.type === 'focusin';
  }
}