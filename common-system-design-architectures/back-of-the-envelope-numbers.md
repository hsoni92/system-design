# Back-of-the-Envelope Numbers for System Design

Rough numbers to keep in mind for capacity estimation and latency reasoning. Use powers of 2 and round figures for quick mental math.

---

## Memory hierarchy (latency, approximate)

| Level        | Latency   | Bandwidth (order of magnitude) |
|-------------|-----------|---------------------------------|
| L1 cache    | ~1 ns     | ~100s GB/s                      |
| L2 cache    | ~4 ns     | ~100s GB/s                      |
| L3 cache    | ~12 ns    | ~100s GB/s                      |
| RAM         | ~100 ns   | ~10–25 GB/s                     |
| SSD         | ~100 μs   | ~500 MB/s – 3 GB/s (read)       |
| HDD         | ~10 ms    | ~100–200 MB/s                   |
| Network (DC)| ~0.5 ms   | ~1–10 Gbps per link             |

**Rule of thumb:** Each step down the hierarchy is roughly **10×–100×** slower.

---

## Storage (read / write speed)

| Storage type | Read speed      | Write speed     | Random I/O      |
|-------------|-----------------|-----------------|-----------------|
| SSD (NVMe)  | 2–7 GB/s        | 1–5 GB/s        | 100K–1M IOPS    |
| SSD (SATA)  | 500 MB/s        | 400 MB/s        | 10K–100K IOPS   |
| HDD         | 100–200 MB/s    | 100–200 MB/s    | 100–200 IOPS    |

- **SSD:** ~100 μs latency; good for random access.
- **HDD:** ~5–10 ms seek + ~100 MB/s sequential; avoid random I/O when possible.

---

## Network latency (round-trip, RTT)

| Scenario              | RTT (typical) |
|-----------------------|----------------|
| Same machine (loopback)| &lt; 0.1 ms   |
| Same rack / same DC   | 0.5–1 ms      |
| Same region (cross-AZ)| 1–5 ms        |
| Cross-region (US–EU)  | 50–150 ms     |
| Cross-continent       | 100–200 ms    |

**Useful:** 1 ms ≈ 200 km at light speed in fiber (for rough geo estimates).

---

## Network bandwidth (per connection / link)

| Context           | Typical range   |
|-------------------|-----------------|
| Datacenter link   | 1–10 Gbps       |
| Cross-DC / WAN    | 100 Mbps–1 Gbps |
| Home broadband    | 10–100 Mbps     |
| Mobile            | 1–50 Mbps       |

---

## Throughput (requests per second, rough)

| Component / scenario | QPS (order of magnitude)     |
|----------------------|------------------------------|
| Single server (simple API) | 1K–10K                    |
| Single server (cached)    | 10K–100K                  |
| Single DB (read-heavy)    | 1K–10K                    |
| Single DB (write-heavy)   | 100–1K (writes cost more) |
| Redis (in-memory)         | 100K–1M                   |
| Kafka (per partition)     | 10K–100K messages/s       |

---

## Capacity (for estimation)

| Item              | Approximate size / count      |
|-------------------|-------------------------------|
| UUID              | 16 bytes (128 bits)           |
| Short URL id (8 char base62) | 8 bytes storage, 6 bytes if numeric |
| 1 KB object       | 1 KB                          |
| 1 MB object       | 1 MB                          |
| IPv4 address      | 4 bytes                       |
| IPv6 address      | 16 bytes                      |
| Timestamp (epoch ms) | 8 bytes                    |
| 1 million rows (narrow) | ~10–100 MB (depends on schema) |
| 1 billion rows    | ~10–100 GB                    |

---

## Time (for conversion and limits)

| Unit   | In seconds | In ms   |
|--------|------------|--------|
| 1 s    | 1          | 1,000  |
| 1 min  | 60         | 60,000 |
| 1 hour | 3,600      | 3.6e6  |
| 1 day  | 86,400     | 86.4e6 |
| 1 year | ~3.15e7    | ~31.5e9 |

- **1 day ≈ 10^5 s** (100,000 s) — easy for “per day” calculations.
- **1 year ≈ π × 10^7 s** — useful for yearly traffic.

---

## Powers of 2 (for capacity and rates)

| Power | Value   | Power | Value    |
|-------|---------|-------|----------|
| 2^10  | 1 K     | 2^30  | 1 G      |
| 2^20  | 1 M     | 2^40  | 1 T      |

- **1 million ≈ 2^20**, **1 billion ≈ 2^30** — good for “how many bits to address N items?”

---

## Quick mental checks

1. **Latency:** Cache &lt; RAM &lt; SSD &lt; HDD &lt; network (same DC) &lt; cross-region.
2. **Throughput:** In-memory (Redis/cache) &gt; DB reads &gt; DB writes; add caching to move work left.
3. **Storage:** Prefer SSDs for random I/O and low latency; HDDs for cheap, sequential bulk.
4. **Network:** Minimize cross-region calls; batch and compress when you must.
5. **Scaling:** 1 server → 10 → 100 → 1K; each step often needs load balancer, sharding, or replication.

Use these as **starting points**; adjust for your problem’s scale and constraints.
