// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.ArrayList;
import java.util.Comparator;

public final class FindMeetingQuery {
  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {
    // Sort events by start time
    List<Event> sortedEvents = new ArrayList(events);
    List<TimeRange> foundSlots = new ArrayList();

    Collections.sort(sortedEvents, compareByStartTime);

    int eventIndex = 0, startTime = TimeRange.START_OF_DAY, endTime = startTime;
    boolean searching = false;
    Event nextEvent = null, currentEvent = null;
    //int[] slotRange = new int[] {TimeRange.START_OF_DAY, TimeRange.START_OF_DAY};

    System.out.println("*** START HERE ***");
    while (eventIndex < sortedEvents.size()) {

      nextEvent = sortedEvents.get(eventIndex);
      if (hasAttendee(request, nextEvent)) {
        if (!searching) {
          currentEvent = nextEvent;
          endTime = currentEvent.getWhen().start();
          if (endTime - startTime >= request.getDuration()) {
            foundSlots.add(TimeRange.fromStartEnd(startTime, endTime, false));
          }
          startTime = currentEvent.getWhen().end();
          searching = true;
          eventIndex++;
        }
        else {
          if (currentEvent.getWhen().overlaps(nextEvent.getWhen())) {
            currentEvent = findLaterEvent(currentEvent, nextEvent);
            startTime = currentEvent.getWhen().end();
            eventIndex++;
          }
          else {
            searching = false;
          }
        }

      }
      else {
        eventIndex++;
      }
    }

    if (TimeRange.END_OF_DAY - startTime >= request.getDuration()) {
      foundSlots.add(TimeRange.fromStartEnd(startTime, TimeRange.END_OF_DAY, true));
    }

    return foundSlots;
  }

  Comparator<Event> compareByStartTime = new Comparator<Event>() {
    @Override
    public int compare(Event e1, Event e2) {
        return Integer.compare(e1.getWhen().start(), e2.getWhen().start());
    }
  };

  // Given a request and event, checks if any of the request's attendees exist
  // in an event's attendees.
  private boolean hasAttendee(MeetingRequest request, Event e) {
    for (String person : request.getAttendees()) {
      if (e.getAttendees().contains(person)) {
        return true;
      }
    }

    return false;
  }

  private Event findLaterEvent(Event e1, Event e2) {
    if (e1.getWhen().end() > e2.getWhen().end()) {
      return e1;
    }
    else if (e1.getWhen().end() < e2.getWhen().end()) {
      return e2;
    }
    else {
      return e1.getWhen().duration() > e2.getWhen().duration() ? e1 : e2;
    }
  }
}
