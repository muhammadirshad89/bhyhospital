import Image from "next/image";
import Link from "next/link";
import type { Doctor } from "@/lib/types";
import { PlaceholderBadge } from "./Badge";
import { Icon } from "./Icon";

export function DoctorPhoto({ doctor, priority = false }: { doctor: Doctor; priority?: boolean }) {
  if (doctor.photo) {
    return (
      <Image
        className="doctor-photo"
        src={doctor.photo}
        alt={doctor.photoAlt ?? `Portrait of ${doctor.name}`}
        width={266}
        height={266}
        sizes="(min-width: 64rem) 280px, (min-width: 40rem) 33vw, 80vw"
        priority={priority}
        unoptimized={doctor.photo.startsWith("http")}
      />
    );
  }
  return (
    <div className="doctor-photo doctor-photo--empty" role="img" aria-label="Photograph not yet available">
      <Icon name="user" size={64} />
    </div>
  );
}

export function DoctorCard({ doctor, departmentName }: { doctor: Doctor; departmentName?: string | null }) {
  return (
    <article className="doctor-card">
      <div className="doctor-card-photo">
        <DoctorPhoto doctor={doctor} />
      </div>
      <div className="doctor-card-body">
        {doctor.isPlaceholder ? <PlaceholderBadge /> : null}
        {doctor.specialization ? <p className="pill">{doctor.specialization}</p> : null}
        <h3>
          <Link href={`/doctors/${doctor.slug}`} className="stretched">
            {doctor.name}
          </Link>
        </h3>
        {doctor.qualifications.length ? <p className="doctor-quals">{doctor.qualifications.join(", ")}</p> : null}
        {departmentName && departmentName !== doctor.specialization ? <p className="small muted">{departmentName}</p> : null}
        {doctor.scheduleLines.length ? (
          <ul className="doctor-schedule" aria-label={`Consultation timings of ${doctor.name}`}>
            {doctor.scheduleLines.map((l) => (
              <li key={`${l.days}-${l.time}`}>
                <Icon name="clock" size={16} />
                <span>
                  <strong>{l.days}</strong>
                  <span className="time">{l.time}</span>
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="small muted">Timings to be confirmed</p>
        )}
        <span className="card-cta" aria-hidden="true">
          View profile <Icon name="arrow-right" size={16} />
        </span>
      </div>
    </article>
  );
}
