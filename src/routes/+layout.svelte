<script lang="ts">
  import "../app.css";
  import { onMount } from "svelte";
  interface Props {
    children?: import("svelte").Snippet;
  }

  let { children }: Props = $props();

  // The fleet form-e2e probe waits for this before it fills the contact form, so
  // its input is not wiped by hydration.
  onMount(() => document.documentElement.setAttribute("data-hydrated", ""));
</script>

{@render children?.()}
