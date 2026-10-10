import http from './http';
import { timeLabel, seatLabel } from '../utils/format';

/* =========================================================
   TIME HELPERS
========================================================= */

const timeValue = (label) => {
  if (!label) return '';

  const value = String(label).trim();

  // Already in backend format
  if (/^\d{2}:\d{2}$/.test(value)) {
    return value;
  }

  const match = value.match(
    /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i
  );

  if (!match) {
    return value;
  }

  let hour = Number(match[1]);
  const minute = match[2];
  const period = match[3].toUpperCase();

  if (period === 'PM' && hour !== 12) {
    hour += 12;
  }

  if (period === 'AM' && hour === 12) {
    hour = 0;
  }

  return `${String(hour).padStart(2, '0')}:${minute}`;
};

/* =========================================================
   NORMALIZE SHOW
========================================================= */

export const normalizeShow = (s = {}) => {
  const movie =
    s.movie ||
    {
      id: s.movieId ?? null,
      title: s.movieTitle ?? '',
      posterUrl: s.moviePosterUrl ?? '',
    };

  const theatre =
    s.theatre ||
    {
      id: s.theatreId ?? null,
      name: s.theatreName ?? '',
      area: s.theatreArea ?? s.area ?? '',
      address: s.theatreAddress ?? s.address ?? '',
      city: s.city ?? s.cityName ?? '',
      facilities: s.theatreFacilities ?? s.facilities ?? [],
    };

  const movieId =
    s.movieId ??
    s.movie?.id ??
    movie.id ??
    null;

  const theatreId =
    s.theatreId ??
    s.theatre?.id ??
    theatre.id ??
    null;

  const showDate =
    s.showDate ??
    s.date ??
    '';

  const startTime =
    s.startTime ??
    '';

  const endTime =
    s.endTime ??
    '';

  const price = Number(
    s.basePrice ??
    s.price ??
    0
  );

  return {
    ...s,

    id: s.id,

    movieId,

    movie,

    theatreId,

    theatre: {
      ...theatre,

      id: theatreId,

      name:
        theatre.name ??
        s.theatreName ??
        '',

      address:
        theatre.address ??
        s.address ??
        '',

      city:
        theatre.city ??
        s.city ??
        s.cityName ??
        '',

      facilities:
        Array.isArray(theatre.facilities)
          ? theatre.facilities
          : typeof theatre.facilities === 'string'
            ? theatre.facilities
              .split(',')
              .map((item) => item.trim())
              .filter(Boolean)
            : [],
    },

    date: showDate,

    showDate,

    startTime,

    endTime,

    time:
      s.time ??
      timeLabel(startTime),

    price,

    basePrice: price,

    screen:
      s.screen ??
      s.screenName ??
      '',

    screenId:
      s.screenId ??
      s.screen?.id ??
      null,
  };
};

/* =========================================================
   GROUP SHOWS BY THEATRE
========================================================= */

const groupShowsByTheatre = (rows = []) => {
  if (!Array.isArray(rows)) {
    return [];
  }

  const grouped = new Map();

  rows
    .map(normalizeShow)
    .forEach((show) => {
      const theatreId =
        show.theatreId ??
        show.theatre?.id;

      /*
       * If backend doesn't provide theatre ID,
       * don't create an invalid "undefined" theatre.
       */
      if (!theatreId) {
        return;
      }

      if (!grouped.has(theatreId)) {
        grouped.set(theatreId, {
          id: theatreId,

          name:
            show.theatre?.name ||
            show.theatreName ||
            'Theatre',

          area:
            show.theatre?.area ||
            '',

          address:
            show.theatre?.address ||
            '',

          city:
            show.theatre?.city ||
            '',

          facilities:
            Array.isArray(show.theatre?.facilities)
              ? show.theatre.facilities
              : [],

          movieCount: 0,

          shows: [],
        });
      }

      const theatre = grouped.get(theatreId);

      theatre.shows.push({
        ...show,

        id: show.id,

        movieId: show.movieId,

        time:
          show.time ||
          timeLabel(show.startTime),

        price: Number(
          show.basePrice ??
          show.price ??
          0
        ),
      });
    });

  return [...grouped.values()].map((theatre) => {
    const uniqueMovies = new Set(
      theatre.shows
        .map((show) => show.movieId)
        .filter(Boolean)
    );

    return {
      ...theatre,

      movieCount: uniqueMovies.size || 1,

      distance:
        theatre.distance || '',

      shows: theatre.shows.sort((a, b) => {
        return String(a.startTime || '').localeCompare(
          String(b.startTime || '')
        );
      }),
    };
  });
};

/* =========================================================
   SHOW API
========================================================= */

export const showApi = {

  /*
   * GET SHOWS FOR MOVIE + DATE
   *
   * Backend:
   * GET /api/shows/movie/{movieId}/date/{date}
   *
   * Example:
   * /api/shows/movie/2/date/2026-10-09
   */
  listByCity: async (params = {}) => {
    /*
     * Fallback:
     * get all shows if movie/date are not available.
     */
    const response = await http.get('/api/shows', {
      params: {
        city: params.city,
        date: params.date,
        movieId: params.movieId,
      },
    });

    const rows = Array.isArray(response.data)
      ? response.data
      : [];

    /*
     * Backend might already return:
     *
     * [
     *   {
     *     id: 1,
     *     name: "INOX",
     *     shows: [...]
     *   }
     * ]
     *
     * In that case, normalize the existing groups.
     */
    if (
      rows.length > 0 &&
      Array.isArray(rows[0]?.shows)
    ) {
      return rows.map((theatre) => ({
        ...theatre,

        facilities:
          Array.isArray(theatre.facilities)
            ? theatre.facilities
            : typeof theatre.facilities === 'string'
              ? theatre.facilities
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean)
              : [],

        shows: theatre.shows.map(normalizeShow),

        movieCount:
          theatre.movieCount ??
          1,
      }));
    }

    return groupShowsByTheatre(rows);
  },

  /* GET SINGLE SHOW */
  get: async (id) => {
    const response = await http.get(
      `/api/shows/${id}`
    );

    return normalizeShow(response.data);
  },

  /* GET SEATS FOR SHOW */
  seats: async (id) => {
    const response = await http.get(
      `/api/shows/${id}/seats`
    );

    const rows = Array.isArray(response.data)
      ? response.data
      : [];

    return rows.map((s) => ({
      ...s,

      id:
        s.id ??
        s.seatId,

      row:
        s.row ??
        s.rowLabel ??
        '',

      number:
        s.number ??
        s.seatNumber ??
        '',

      label:
        seatLabel({
          row: s.row ?? s.rowLabel,
          number: s.number ?? s.seatNumber,
        }),

      type:
        s.type ??
        s.seatType ??
        'REGULAR',

      price: Number(
        s.price ??
        0
      ),

      sold:
        s.sold ??
        s.booked ??
        s.available === false,
    }));
  },
};

/* =========================================================
   SCREEN API
========================================================= */

export const screenApi = {

  list: async (params = {}) => {
    const response = await http.get(
      '/api/screens',
      {
        params,
      }
    );

    return Array.isArray(response.data)
      ? response.data
      : [];
  },

  get: async (id) => {
    const response = await http.get(
      `/api/screens/${id}`
    );

    return response.data;
  },
};

/* =========================================================
   ADMIN SCREEN API
========================================================= */

export const adminScreenApi = {

  list: async (params = {}) => {
    const response = await http.get(
      '/api/admin/screens',
      {
        params,
      }
    );

    return Array.isArray(response.data)
      ? response.data
      : [];
  },

  create: async (body) => {
    const payload = {
      theatreId: Number(body.theatreId),

      name: body.name,

      active:
        body.active ??
        true,
    };

    const response = await http.post(
      '/api/admin/screens',
      payload
    );

    return response.data;
  },

  update: async (id, body) => {
    const payload = {
      theatreId: Number(body.theatreId),

      name: body.name,

      active:
        body.active ??
        true,
    };

    const response = await http.put(
      `/api/admin/screens/${id}`,
      payload
    );

    return response.data;
  },

  remove: async (id) => {
    const response = await http.delete(
      `/api/admin/screens/${id}`
    );

    return response.data;
  },
};

/* =========================================================
   ADMIN SEAT API
========================================================= */

export const adminSeatApi = {

  list: async (params = {}) => {
    const response = await http.get(
      '/api/admin/seats',
      {
        params,
      }
    );

    return Array.isArray(response.data)
      ? response.data
      : [];
  },

  get: async (id) => {
    const response = await http.get(
      `/api/admin/seats/${id}`
    );

    return response.data;
  },

  create: async (body) => {
    const payload = {
      screenId: Number(body.screenId),

      seatNumber:
        body.seatNumber,

      rowLabel:
        body.rowLabel,

      seatType:
        body.seatType,

      price: Number(
        body.price
      ),

      active:
        body.active ??
        true,
    };

    const response = await http.post(
      '/api/admin/seats',
      payload
    );

    return response.data;
  },

  update: async (id, body) => {
    const payload = {
      screenId: Number(body.screenId),

      seatNumber:
        body.seatNumber,

      rowLabel:
        body.rowLabel,

      seatType:
        body.seatType,

      price: Number(
        body.price
      ),

      active:
        body.active ??
        true,
    };

    const response = await http.put(
      `/api/admin/seats/${id}`,
      payload
    );

    return response.data;
  },

  remove: async (id) => {
    const response = await http.delete(
      `/api/admin/seats/${id}`
    );

    return response.data;
  },
};

/* =========================================================
   ADMIN SHOW API
========================================================= */

export const adminShowApi = {

  /* GET ALL ADMIN SHOWS */
  list: async () => {
    const response = await http.get(
      '/api/admin/shows'
    );

    const rows = Array.isArray(response.data)
      ? response.data
      : [];

    return rows.map(normalizeShow);
  },

  /* CREATE SHOW */
  create: async (body) => {
    const payload = {
      movieId:
        Number(body.movieId),

      screenId:
        Number(body.screenId),

      showDate:
        body.showDate ||
        body.date,

      startTime:
        timeValue(
          body.startTime ||
          body.time
        ),

      endTime:
        timeValue(
          body.endTime ||
          body.time
        ),

      basePrice:
        Number(
          body.basePrice ??
          body.price ??
          0
        ),

      language:
        body.language ||
        'Hindi',

      format:
        body.format ||
        '2D',

      status:
        body.status ||
        'SCHEDULED',

      active:
        body.active ??
        true,
    };

    const response = await http.post(
      '/api/admin/shows',
      payload
    );

    return normalizeShow(
      response.data
    );
  },

  /* UPDATE SHOW */
  update: async (id, body) => {
    const payload = {
      movieId:
        Number(body.movieId),

      screenId:
        Number(body.screenId),

      showDate:
        body.showDate ||
        body.date,

      startTime:
        timeValue(
          body.startTime ||
          body.time
        ),

      endTime:
        timeValue(
          body.endTime ||
          body.time
        ),

      basePrice:
        Number(
          body.basePrice ??
          body.price ??
          0
        ),

      language:
        body.language ||
        'Hindi',

      format:
        body.format ||
        '2D',

      status:
        body.status ||
        'SCHEDULED',

      active:
        body.active ??
        true,
    };

    const response = await http.put(
      `/api/admin/shows/${id}`,
      payload
    );

    return normalizeShow(
      response.data
    );
  },

  /* DELETE SHOW */
  remove: async (id) => {
    const response = await http.delete(
      `/api/admin/shows/${id}`
    );

    return response.data;
  },
};