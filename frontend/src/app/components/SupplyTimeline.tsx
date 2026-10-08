import { JourneyStep } from "../../data/batches";

type SupplyTimelineProps = {
  journey: JourneyStep[];
};

export default function SupplyTimeline({
  journey,
}: SupplyTimelineProps) {
  return (
    <section className="timeline-section">

      <div className="section-heading">
        <h2>Supply Chain Journey</h2>

        <p>
          Complete movement history of this medicine batch
        </p>
      </div>

      <div className="timeline">

        {journey.map((step, index) => (
          <div
            className="timeline-item"
            key={`${step.role}-${index}`}
          >

            <div className="timeline-marker">
              ✓
            </div>

            <div className="timeline-content">

              <span className="timeline-role">
                {step.role}
              </span>

              <h3>
                {step.name}
              </h3>

              <p>
                {step.action}
              </p>

              <div className="timeline-meta">

                <span>
                  📍 {step.location}
                </span>

                <span>
                  🕒 {step.date}
                </span>

              </div>

            </div>

          </div>
        ))}

      </div>

    </section>
  );
}