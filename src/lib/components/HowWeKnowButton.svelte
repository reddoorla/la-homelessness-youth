<script lang="ts">
  import { onMount } from "svelte";

  interface Props {
    text?: string;
    reportLink: string;
    color?: "blue" | "purple" | "red";
    class?: string;
  }
  let { text = "", reportLink, color = "blue", class: klass = "" }: Props = $props();

  let infoBox: HTMLElement | undefined = $state();
  let isOpen = $state(false);
  let isHovered = $state(false);
  let reservedTextHeight = $state(0);

  onMount(() => {
    reservedTextHeight = infoBox?.getBoundingClientRect().height ?? 0;
    setTimeout(() => (reservedTextHeight = infoBox?.getBoundingClientRect().height ?? 0), 1800);
  });
</script>

<div
  class="w-[320px] sm:w-[400px] absolute bottom-32 md:bottom-12 z-20 left-4 lg:left-32 transition-all pointer-events-none {klass}"
  bind:this={infoBox}
>
  <button
    class="absolute z-10 transition-all duration-500 left-5 pointer-events-auto {isHovered
      ? 'boop brightness-125'
      : ''}"
    style="top: {isOpen ? '-32' : reservedTextHeight - 64}px"
    onclick={() => (isOpen = !isOpen)}
    onmouseover={() => (isHovered = true)}
    onfocus={() => (isHovered = true)}
    onmouseout={() => (isHovered = false)}
    onblur={() => (isHovered = false)}
    aria-label="How we know"
  >
    <svg
      class={color === "red" ? "text-light-pink" : "text-light-" + color}
      width="46"
      height="46"
      viewBox="0 0 46 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="asterisk icon pulse">
        <path
          id="*"
          d="M9.64159 38.297L8.76053 36.3587L12.3729 27.5481L2.94556 20.764L13.4301 17.1516L9.02485 6.31461L14.2231 6.05029L23.1218 13.1869L30.8751 6.1384L35.1041 6.05029L30.8751 17.5921L33.5182 18.5613L42.9456 23.4071L31.5799 27.2838L30.0821 39.8829L22.0645 30.1913L9.64159 38.297Z"
          fill="currentColor"
        />
      </g>
    </svg>
  </button>
  <button
    class="absolute transition-all bottom-7 left-20 pointer-events-auto {color === 'red'
      ? 'text-light-pink'
      : 'text-light-' + color} pointer-events-auto duration-500 {isHovered
      ? 'brightness-125'
      : ''} {isOpen ? '-bottom-[100%] opacity-0' : 'bottom-4'}"
    onclick={() => (isOpen = !isOpen)}
    onmouseover={() => (isHovered = true)}
    onfocus={() => (isHovered = true)}
    onmouseout={() => (isHovered = false)}
    onblur={() => (isHovered = false)}
  >
    HOW WE KNOW
  </button>

  <div
    class="w-full rounded-lg
            {color === 'blue' ? 'bg-[#1A52E3]' : ''}
            {color === 'purple' ? 'bg-purple' : ''}
            {color === 'red' ? 'bg-darkest-red' : ''}
            p-5 transition-opacity duration-500
            {isOpen ? 'opacity-100 delay-200' : 'opacity-0 pointer-events-none'}"
  >
    <p class="text-[#EAD4DF] paragraph-2 text-left">
      {text}
    </p>
    <a
      class="bump flex flex-row pt-5 gap-5 {isOpen
        ? 'pointer-events-auto'
        : 'pointer-events-none'} hover:brightness-125 {color === 'red'
        ? 'text-light-pink'
        : 'text-light-' + color}"
      href={reportLink}
      target="_blank"
    >
      <div class="btn-text">READ THE REPORT</div>
      <svg
        class="w-20 hover:brightness-125"
        viewBox="0 0 150 31"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          id="Vector"
          d="M3.05339 11.2409C38.1895 7.973 73.546 7.74546 108.722 10.5023C116.387 11.1044 124.041 11.8571 131.671 12.7373C131.13 12.4335 130.58 12.1442 130.035 11.8439C125.375 9.31656 120.715 6.78918 116.056 4.2618C114.907 3.64365 113.317 2.18852 114.418 0.820324C115.464 -0.484194 118.091 0.090017 119.293 0.744115C124.825 3.73931 130.357 6.73451 135.882 9.74452C140.394 12.1871 147.405 14.5337 149.421 19.7056C149.78 20.6233 149.582 21.3361 148.718 21.8718C142.302 25.772 135.318 28.5632 127.993 30.2237C126.304 30.5998 124.06 29.9674 122.949 28.5989C121.941 27.3684 122.308 25.9412 123.93 25.5691C130.241 24.1378 136.174 21.7916 141.763 18.5906C141.592 18.4013 141.42 18.2341 141.233 18.0662C140.521 18.3513 139.606 18.3718 138.964 18.299C104.576 13.9307 69.8531 12.4908 35.2271 14.0388C25.2928 14.4845 15.3646 15.1773 5.4654 16.0971C2.22322 16.4101 -1.83735 11.7036 3.05339 11.2409Z"
          fill="currentColor"
        />
      </svg>
    </a>
  </div>
</div>

<style>
  @keyframes boop {
    0% {
      transform: rotate(0deg);
    }
    20% {
      transform: rotate(-15deg);
    }
    40% {
      transform: rotate(15deg);
    }
    60% {
      transform: rotate(-7deg);
    }
    80% {
      transform: rotate(7deg);
    }
    90% {
      transform: rotate(-3deg);
    }
    95% {
      transform: rotate(2deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
  .boop {
    animation: 1s boop forwards running;
  }
</style>
