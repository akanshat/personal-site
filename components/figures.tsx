/*
 * The small drawings beside each case study on the home page. Hand-written SVG,
 * coloured from the palette tokens so they follow every palette, light or dark.
 */

const QUERY_Y = [28, 66, 104, 142];

/** Four identical queries reach groupcache; one request goes on to storage. */
function CacheFigure() {
  return (
    <svg
      viewBox="0 0 400 170"
      role="img"
      aria-label="Four identical queries reach groupcache; one request goes on to storage."
    >
      {QUERY_Y.map((y) => (
        <g key={y}>
          <rect
            x="10"
            y={y - 13}
            width="70"
            height="26"
            rx="7"
            fill="var(--bg-elev)"
            stroke="var(--fg)"
            strokeWidth="1.3"
          />
          <text x="45" y={y + 4} textAnchor="middle">
            query
          </text>
          <path
            d={`M80 ${y} C 130 ${y}, 130 85, 168 85`}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1.6"
          />
        </g>
      ))}
      <rect x="168" y="62" width="100" height="46" rx="11" fill="var(--fg)" />
      <text x="218" y="89" textAnchor="middle" style={{ fill: 'var(--bg-elev)' }}>
        groupcache
      </text>
      <path d="M268 85 L 322 85" stroke="var(--accent)" strokeWidth="1.6" strokeDasharray="4 3" />
      <text x="295" y="76" textAnchor="middle" className="strong">
        1 trip
      </text>
      <path
        d="M326 66 v38 a30 8 0 0 0 60 0 v-38"
        fill="var(--bg-elev)"
        stroke="var(--fg)"
        strokeWidth="1.3"
      />
      <ellipse cx="356" cy="66" rx="30" ry="8" fill="var(--bg-elev)" stroke="var(--fg)" strokeWidth="1.3" />
      <text x="356" y="134" textAnchor="middle">
        object storage
      </text>
      <text x="125" y="164" textAnchor="middle" className="strong">
        4 queries
      </text>
    </svg>
  );
}

const TREE = [
  ['Plant', 0],
  ['Chiller plant', 1],
  ['Chiller 1', 2],
  ['Pump 1A', 3],
  ['Pump 1B', 3],
  ['Chiller 2', 2],
  ['Cooling tower', 1],
  ['Fan 3', 2],
  ['Sensor T-104', 3],
] as const;

/** A searchable tree of plant components, with only the visible rows drawn. */
function MapFigure() {
  return (
    <svg
      viewBox="0 0 400 200"
      role="img"
      aria-label="A searchable tree of plant components, with only the visible rows rendered."
    >
      <rect
        x="6"
        y="8"
        width="254"
        height="186"
        rx="10"
        fill="var(--bg-elev)"
        stroke="var(--border-strong)"
      />
      <rect x="14" y="16" width="238" height="20" rx="6" fill="var(--bg-sunken)" />
      <text x="22" y="30" style={{ fontSize: 9.5 }}>
        ⌕ search 10,000+ components
      </text>
      {TREE.map(([label, depth], i) => {
        const y = 52 + i * 15;
        const x = 22 + depth * 14;
        const selected = i === 3;
        return (
          <g key={label}>
            {selected && <rect x="14" y={y - 10} width="236" height="14" rx="3" fill="var(--accent-soft)" />}
            <rect
              x={x}
              y={y - 6}
              width="6"
              height="6"
              rx="1.5"
              fill={depth < 2 ? 'var(--fg)' : 'var(--fg-subtle)'}
            />
            <text
              x={x + 11}
              y={y}
              style={{ fontSize: 9.5, ...(selected ? { fill: 'var(--accent-ink)', fontWeight: 600 } : {}) }}
            >
              {label}
            </text>
          </g>
        );
      })}
      <rect x="252" y="44" width="4" height="40" rx="2" fill="var(--accent)" />
      <rect x="252" y="44" width="4" height="142" rx="2" fill="var(--accent)" opacity=".12" />
      <path d="M272 64 h18" stroke="var(--accent)" strokeWidth="1.3" />
      <text x="296" y="60" className="strong">
        only visible
      </text>
      <text x="296" y="73">
        rows are drawn
      </text>
      <path d="M272 30 h18" stroke="var(--fg-subtle)" strokeWidth="1.3" />
      <text x="296" y="26" className="strong">
        search API
      </text>
      <text x="296" y="39">
        paginated
      </text>
      <text x="296" y="128" className="strong">
        1,000s
      </text>
      <text x="296" y="141">
        of components
      </text>
      <text x="296" y="154">
        per plant
      </text>
    </svg>
  );
}

/** Three dense, noisy series drawn from a fixed seed, so the drawing is the same on every render. */
function chartPaths() {
  let seed = 11;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  return ['var(--accent)', 'var(--s2)', 'var(--s3)'].map((color, k) => {
    let y = 70 + k * 28;
    let d = `M20 ${y.toFixed(1)}`;
    for (let x = 20; x <= 380; x += 1.2) {
      y += (rand() - 0.5) * 6 + (90 - 15 + k * 22 - y) * 0.02 + Math.sin(x / (18 + k * 9)) * 0.9;
      d += ` L${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    return { color, d };
  });
}

const CHART = chartPaths();

/** A chart with several dense series of about a million points each. */
function ChartFigure() {
  return (
    <svg
      viewBox="0 0 400 200"
      role="img"
      aria-label="A chart with several dense series of about a million points each."
    >
      <rect
        x="6"
        y="8"
        width="388"
        height="186"
        rx="10"
        fill="var(--bg-elev)"
        stroke="var(--border-strong)"
      />
      {[0, 1, 2, 3].map((g) => (
        <line key={g} x1="20" x2="380" y1={36 + g * 36} y2={36 + g * 36} stroke="var(--border)" />
      ))}
      {CHART.map((p) => (
        <path key={p.color} d={p.d} fill="none" stroke={p.color} strokeWidth=".9" opacity=".9" />
      ))}
      <text x="20" y="26" className="strong">
        6+ series
      </text>
      <text x="86" y="26">
        × ~1,000,000 points each
      </text>
      <text x="20" y="186">
        picked AG Charts over Highcharts for this
      </text>
    </svg>
  );
}

export const caseFigures: Record<string, () => React.JSX.Element> = {
  'thanos-groupcache': CacheFigure,
  'plant-data-mapping': MapFigure,
  'million-point-charts': ChartFigure,
};
