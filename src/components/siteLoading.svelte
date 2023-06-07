<script>
    import { _ } from 'svelte-i18n';
    import { fade } from "svelte/transition";
</script>

<div class="site-loading" out:fade>
    {$_('text.loading')}
</div>

<style>
    .site-loading {
        height: 100vh;
        width: 100vw;
        background-color: var(--color-background);
        z-index: 9999;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 30px;
    }
</style>