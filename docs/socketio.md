# Socket.io Design

The goal of adding in `socket.io` is to enable the client to react to data changes. While there's a lot of features that
could be added as part of the campaign support, initially simply updating the state of the currently selected character
is a killer feature; this way a GM can watching his players sheets live. However, since we don't know what all we're
going to want to do with `socket.io` in the end, we need to design it in a more modular form.

## Message Envelope

We will use a very basic message envelope that will allow us to handle routing however we need to in the future.

```typescript
export interface RPGKEnvelope {
    type : 'update', 'event';           // The type of message this is
    resource ?: string;                 // The resource it's effecting
    payload : Record<string, unknown>;  // The payload for the message
}
```

This allows us, for example, to send out a character update message like the following:

```json
{
    "type": "update",
    "resource": "30UUIP",
    "payload": { ... }
}
```

We can also, in the future, have a series of events to fire off to trigger things in the client, like:

```json
{
    "type": "event",
    "resource": "campaign:joined",
    "payload": {
        "campaign": "4ulHfM"
     }
}
```

This could pop a notification that you've been added to a campaign.

## Namespaces

For things, like characters, we can simply broadcast the new state of the character on a namespace. Something like
`/character`. The character manager will only update the characters, if we already have that model loaded. 
