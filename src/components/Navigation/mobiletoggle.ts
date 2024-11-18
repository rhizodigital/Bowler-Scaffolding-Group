import transitionCompleted from "../../utils/transitioned";

export class MobileMenuToggle extends HTMLElement {
  private button: HTMLButtonElement | null;
  private menu: HTMLElement | null;
  private transitioning: boolean = false;

  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  connectedCallback() {
    this.button = this.querySelector("button");
    if (!this.button) {
      console.warn("[MobileMenuToggle] Button not found inside the component");
      return;
    }
    const targetSelector = this.getAttribute("menu-target");

    if (!targetSelector) {
      console.warn("[MobileMenuToggle] Mobile menu target not found");
      return;
    }

    this.menu = document.querySelector(targetSelector);

    if (!this.menu) {
      console.warn(
        `[MobileMenuToggle] Menu element not found with selector ${targetSelector}`
      );
      return;
    }
    this.button.addEventListener("click", this.handleClick);
    document.addEventListener("click", this.handleOutsideClick.bind(this));
  }

  handleClick() {
    this.toggleMobileMenu();
  }

  handleOutsideClick(event: MouseEvent) {
    if (!this.menu || !this.button) {
      return;
    }
    if (
      this.menu.getAttribute("data-mobile-menu") === "open" &&
      !this.menu.contains(event.target as Node) &&
      !this.button.contains(event.target as Node)
    ) {
      this.closeMobileMenu();
    }
  }

  async openMobileMenu() {
    if (
      this.transitioning ||
      this.menu.getAttribute("data-mobile-menu") === "open"
    ) {
      return;
    }
    this.buttonState(true);
    this.menu.classList.remove("hidden");
    requestAnimationFrame(async () => {
      this.menu.setAttribute("data-mobile-menu", "open");
      this.transitioning = true;
      await transitionCompleted(this.menu);
      this.transitioning = false;
    });
  }

  async closeMobileMenu() {
    if (
      this.transitioning ||
      this.menu.getAttribute("data-mobile-menu") === "closed"
    ) {
      return;
    }
    this.buttonState(false);
    this.menu.setAttribute("data-mobile-menu", "closed");
    this.transitioning = true;
    await transitionCompleted(this.menu);
    this.transitioning = false;
    this.menu.classList.add("hidden");
  }

  toggleMobileMenu() {
    if (this.menu.getAttribute("data-mobile-menu") === "open") {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  disconnectedCallback() {
    if (this.button) {
      this.button.removeEventListener("click", this.handleClick);
    }
    document.removeEventListener("click", this.handleOutsideClick.bind(this));
  }

  buttonState(menustate: Boolean = false) {
    const openIcon = this.button?.querySelector(".open-icon");
    const closeIcon = this.button?.querySelector(".close-icon");
    if (menustate) {
      this.button?.setAttribute("aria-expanded", "true");
      openIcon?.classList.add("hidden");
      closeIcon?.classList.remove("hidden");
    } else {
      this.button?.setAttribute("aria-expanded", "false");
      openIcon?.classList.remove("hidden");
      closeIcon?.classList.add("hidden");
    }
  }
}

if (typeof window !== "undefined") {
  customElements.define("mobile-menu-toggle", MobileMenuToggle);
}

declare global {
  interface HTMLElementTagNameMap {
    "mobile-menu-toggle": MobileMenuToggle;
  }
}
