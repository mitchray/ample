<script>
    let { data = {} } = $props();

    const { label, variant } = $derived.by(() => {
        const creationDate = data.creation_date;
        const expireDays = data.expire_days;
        const now = Date.now() / 1000;
        if (expireDays == null || expireDays <= 0) {
            return { label: "No expiry", variant: "primary" };
        }
        const expiryTs = creationDate + expireDays * 86400;
        const daysLeft = (expiryTs - now) / 86400;
        if (daysLeft <= 0) {
            return { label: "Expired", variant: "danger" };
        }
        if (daysLeft <= 2) {
            return { label: "Close to expiry", variant: "warning" };
        }
        return { label: "Active", variant: "success" };
    });
</script>

<sl-badge pill {variant}>{label}</sl-badge>
