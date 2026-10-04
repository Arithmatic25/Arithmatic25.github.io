"""Stage 1: generate synthetic CNC readings using only built-in Python tools."""

import json
import random
import time
from datetime import datetime, timezone
from pathlib import Path


TOTAL_SAMPLES = 30
SAMPLE_INTERVAL_SECONDS = 1
TEMP_RISE_PER_SAMPLE_C = 2.0
OUTPUT_FILE = Path(__file__).resolve().parent / "data" / "machine_data.jsonl"


def make_reading(sample_number, parts_total, rng):
    """Return one labelled set of machine values. These are invented demo values."""
    if sample_number < 10:
        # Normal cutting: a little warming and ordinary measurement noise.
        state = "RUNNING"
        temperature = 55.0 + 0.1 * sample_number
        vibration = 1.2
        rpm = round(rng.gauss(6000, 30))
    elif sample_number < 20:
        # Deliberately introduce a trend we can detect in a later stage.
        state = "RUNNING"
        temperature = 56.0 + TEMP_RISE_PER_SAMPLE_C * (sample_number - 10)
        vibration = 1.2 + 0.45 * (sample_number - 10)
        rpm = round(rng.gauss(6000, 30))
    else:
        # A scripted stop: rotation stops, but the hot bearing cools gradually.
        state = "STOPPED"
        temperature = 56.0 + 9 * TEMP_RISE_PER_SAMPLE_C - 0.5 * (sample_number - 20)
        vibration = 0.05
        rpm = 0

    return {
        "timestamp_utc": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "machine_id": "CNC-01",
        "machine_state": state,
        "bearing_temp_c": round(temperature + rng.gauss(0, 0.2), 2),
        "vibration_mm_s": round(max(0, vibration + rng.gauss(0, 0.03)), 2),
        "spindle_rpm": rpm,
        "parts_total": parts_total,
    }


def main():
    # A fixed seed repeats the demo's random noise; timestamps still change.
    rng = random.Random(42)
    parts_total = 0
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    print("CNC demo: 10 normal readings, 10 rising readings, 10 stopped readings.")
    print("Synthetic, accelerated data. Press Ctrl+C to stop.\n")

    # 'w' replaces this demo file each time you run the program.
    with OUTPUT_FILE.open("w", encoding="utf-8") as log:
        for sample_number in range(TOTAL_SAMPLES):
            # Invented cycle time: one finished part per five running samples.
            if sample_number < 20 and (sample_number + 1) % 5 == 0:
                parts_total += 1

            reading = make_reading(sample_number, parts_total, rng)
            log.write(json.dumps(reading) + "\n")
            log.flush()
            print(
                f"{sample_number + 1:02d} | {reading['machine_state']:7} | "
                f"Temp {reading['bearing_temp_c']:5.2f} C | "
                f"Vibration {reading['vibration_mm_s']:4.2f} mm/s | "
                f"RPM {reading['spindle_rpm']:4} | Parts {parts_total}",
                flush=True,
            )
            if sample_number < TOTAL_SAMPLES - 1:
                time.sleep(SAMPLE_INTERVAL_SECONDS)

    print(f"\nSaved {TOTAL_SAMPLES} readings to {OUTPUT_FILE}")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nStopped. Completed readings are saved in the data folder.")
