import transitionCompleted from "../../utils/transitioned";

export class MobileMenuToggle extends HTMLElement {
  private button: HTMLButtonElement | null;
  private menu: HTMLElement | null;
  private transitioning: boolean = false;
  private isMenuState(state: "open" | "closed"): boolean {
    return this.menu?.getAttribute("data-mobile-menu") === state;
  }

  constructor() {
    super();
    this.button = this.querySelector("button");
    const targetSelector = this.getAttribute("menu-target") || "";
    this.menu = targetSelector ? document.querySelector(targetSelector) : null;

    if (!this.menu) {
      console.warn(
        `[MobileMenuToggle] Menu element not found with selector ${targetSelector}`
      );
    }

    this.handleClick = this.handleClick.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  }

  connectedCallback() {
    if (!this.button) {
      console.warn("[MobileMenuToggle] Button not found inside the component");
      return;
    }

    if (!this.menu) {
      console.warn(`[MobileMenuToggle] Menu element not found`);
      return;
    }
    this.button.addEventListener("click", this.handleClick);
    document.addEventListener("click", this.handleOutsideClick);
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
    if (!this.menu || this.transitioning || this.isMenuState("open")) {
      return;
    }
    this.updateButtonUI(true);
    this.menu.classList.remove("hidden");
    requestAnimationFrame(async () => {
      if (!this.menu) return;
      this.menu.setAttribute("data-mobile-menu", "open");
      this.transitioning = true;
      await transitionCompleted(this.menu);
      this.transitioning = false;
    });
  }

  async closeMobileMenu() {
    if (!this.menu || this.transitioning || this.isMenuState("closed")) {
      return;
    }
    this.updateButtonUI(false);
    this.menu.setAttribute("data-mobile-menu", "closed");
    this.transitioning = true;
    await transitionCompleted(this.menu);
    this.transitioning = false;
    this.menu.classList.add("hidden");
  }

  toggleMobileMenu() {
    if (this.isMenuState("open")) {
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

  updateButtonUI(open: boolean = false) {
    const openIcon = this.button?.querySelector(".open-icon");
    const closeIcon = this.button?.querySelector(".close-icon");
    if (open) {
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
