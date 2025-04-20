export default function extractRelevantPageSpeedData(data: any) {
    return {
      url: data.id,
      overallScore: data.lighthouseResult?.categories?.performance?.score,
      metrics: {
        FCP: data.lighthouseResult?.audits['first-contentful-paint']?.displayValue,
        LCP: data.lighthouseResult?.audits['largest-contentful-paint']?.displayValue,
        CLS: data.lighthouseResult?.audits['cumulative-layout-shift']?.displayValue,
        TBT: data.lighthouseResult?.audits['total-blocking-time']?.displayValue,
      },
      diagnostics: data.lighthouseResult?.audits['diagnostics']?.details?.items[0],
      opportunities: data.lighthouseResult?.categories?.performance?.auditRefs
        ?.filter((r: any) => r.group === 'load-opportunities')
        .map((r: any) => ({
          id: r.id,
          score: r.weight,
        }))
    };
  }
  